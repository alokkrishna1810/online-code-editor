import { NextResponse } from "next/server";
import { dockerExecutor } from "@/lib/docker-executor";

export async function GET() {
  try {
    const isHealthy = await dockerExecutor.healthCheck();
    return NextResponse.json({
      healthy: isHealthy,
      message: isHealthy ? "Docker is running" : "Docker is not available",
    });
  } catch (error) {
    return NextResponse.json(
      {
        healthy: false,
        message: "Health check failed",
      },
      { status: 500 }
    );
  }
}
