"use client";

import { MonacoEditor } from "./monaco-editor";
import { useTheme } from "next-themes";
import type { useFileSystem } from "@/hooks/use-file-system";
import { FileText } from "lucide-react"; // Import FileText component

interface CodeEditorProps {
  fileSystem: ReturnType<typeof useFileSystem>;
}

export function CodeEditor({ fileSystem }: CodeEditorProps) {
  const { theme } = useTheme();
  const { activeFile, getFileContent, updateFileContent } = fileSystem;

  const getLanguageFromFile = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "html":
        return "html";
      case "css":
        return "css";
      case "js":
        return "javascript";
      case "ts":
        return "typescript";
      case "json":
        return "json";
      case "cpp":
      case "cc":
      case "cxx":
      case "c++":
        return "cpp";
      case "py":
        return "python";
      case "java":
        return "java";
      case "c":
        return "c";
      default:
        return "plaintext";
    }
  };

  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />{" "}
          {/* Use FileText component */}
          <p>No file selected</p>
          <p className="text-sm mt-2">
            Open a file from the sidebar to start editing
          </p>
        </div>
      </div>
    );
  }

  const currentContent = getFileContent(activeFile);
  const language = getLanguageFromFile(activeFile);

  return (
    <div className="h-full">
      <MonacoEditor
        value={currentContent}
        language={language}
        onChange={(newContent) => updateFileContent(activeFile, newContent)}
        theme={theme === "dark" ? "vs-dark" : "vs-light"}
        options={{
          contextmenu: true,
          find: {
            addExtraSpaceOnTop: false,
          },
        }}
      />
    </div>
  );
}
