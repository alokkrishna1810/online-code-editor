import Docker from "dockerode";
import * as tar from "tar-stream";
import { Readable } from "stream";

const docker = new Docker();

export interface ExecutionResult {
  output: string;
  error: string;
  exitCode: number;
  executionTime: number;
}

export interface LanguageConfig {
  image: string;
  command: string[];
  filename: string;
  timeout: number;
}

const languageConfigs: Record<string, LanguageConfig> = {
  python: {
    image: "python:3.11-alpine",
    command: ["python", "/app/main.py"],
    filename: "main.py",
    timeout: 10000,
  },
  java: {
    image: "openjdk:17-alpine",
    command: ["sh", "-c", "cd /app && javac Main.java && java Main"],
    filename: "Main.java",
    timeout: 15000,
  },
  cpp: {
    image: "gcc:alpine",
    command: ["sh", "-c", "cd /app && g++ -o main main.cpp && ./main"],
    filename: "main.cpp",
    timeout: 15000,
  },
  c: {
    image: "gcc:alpine",
    command: ["sh", "-c", "cd /app && gcc -o main main.c && ./main"],
    filename: "main.c",
    timeout: 15000,
  },
  javascript: {
    image: "node:18-alpine",
    command: ["node", "/app/main.js"],
    filename: "main.js",
    timeout: 10000,
  },
};

export class DockerExecutor {
  private async createTarArchive(
    filename: string,
    code: string
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const pack = tar.pack();
      const chunks: Buffer[] = [];

      pack.entry({ name: filename }, code);
      pack.finalize();

      pack.on("data", (chunk) => chunks.push(chunk));
      pack.on("end", () => resolve(Buffer.concat(chunks)));
      pack.on("error", reject);
    });
  }

  private async pullImageIfNeeded(image: string): Promise<void> {
    try {
      await docker.getImage(image).inspect();
    } catch (error) {
      console.log(`Pulling image ${image}...`);
      await new Promise((resolve, reject) => {
        docker.pull(image, (err: any, stream: any) => {
          if (err) return reject(err);
          docker.modem.followProgress(stream, resolve);
        });
      });
    }
  }

  async executeCode(
    language: string,
    code: string,
    input?: string
  ): Promise<ExecutionResult> {
    const config = languageConfigs[language];
    if (!config) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const startTime = Date.now();

    try {
      // Pull image if needed
      await this.pullImageIfNeeded(config.image);

      // Create tar archive with code
      const tarArchive = await this.createTarArchive(config.filename, code);

      // Create container
      const container = await docker.createContainer({
        Image: config.image,
        Cmd: config.command,
        WorkingDir: "/app",
        AttachStdout: true,
        AttachStderr: true,
        AttachStdin: !!input,
        OpenStdin: !!input,
        StdinOnce: !!input,
        User: "nobody", // Run as non-root user
        HostConfig: {
          AutoRemove: true,
          ReadonlyRootfs: false,
          NetworkMode: "none", // Disable network access for security
          Tmpfs: {
            "/tmp": "rw,noexec,nosuid,size=100m",
          },
          Memory: 128 * 1024 * 1024, // 128MB memory limit
          CpuShares: 512, // CPU limit
        },
      });

      // Copy code to container
      await container.putArchive(Readable.from(tarArchive), { path: "/app" });

      // Start container
      await container.start();

      // Attach to container for output
      const stream = await container.attach({
        stream: true,
        stdout: true,
        stderr: true,
        stdin: !!input,
      });

      // Send input if provided
      if (input) {
        stream.write(input);
        stream.end();
      }

      // Collect output
      let output = "";
      let error = "";

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(async () => {
          try {
            await container.kill();
            reject(new Error("Execution timeout"));
          } catch (e) {
            reject(new Error("Execution timeout"));
          }
        }, config.timeout);

        container.modem.demuxStream(
          stream,
          // stdout
          (chunk: Buffer) => {
            output += chunk.toString();
          },
          // stderr
          (chunk: Buffer) => {
            error += chunk.toString();
          }
        );

        stream.on("end", async () => {
          clearTimeout(timeout);
          try {
            const containerInfo = await container.inspect();
            const exitCode = containerInfo.State.ExitCode || 0;
            const executionTime = Date.now() - startTime;

            resolve({
              output: output.trim(),
              error: error.trim(),
              exitCode,
              executionTime,
            });
          } catch (e) {
            reject(e);
          }
        });

        stream.on("error", (err: Error) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
    } catch (error) {
      const executionTime = Date.now() - startTime;
      return {
        output: "",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        exitCode: 1,
        executionTime,
      };
    }
  }

  async getAvailableLanguages(): Promise<string[]> {
    return Object.keys(languageConfigs);
  }

  async healthCheck(): Promise<boolean> {
    try {
      await docker.ping();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const dockerExecutor = new DockerExecutor();
