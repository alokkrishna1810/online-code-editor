"use client";

import { MonacoEditor } from "./monaco-editor";
import { useTheme } from "next-themes";
import type { useFileSystem } from "@/hooks/use-file-system";
import { FileText } from "lucide-react";
import { useLiveblocksEditor } from "@/hooks/use-liveblocks-editor";
import { useRoom } from "@liveblocks/react";

interface CodeEditorProps {
  fileSystem: ReturnType<typeof useFileSystem>;
}

export function CodeEditor({ fileSystem }: CodeEditorProps) {
  const { theme } = useTheme();
  const { activeFile, getFileContent, updateFileContent } = fileSystem;
  const room = useRoom();

  // Use Liveblocks for collaborative editing
  const roomId = room?.id || "default-room";
  const {
    code: liveblocksCode,
    language: liveblocksLanguage,
    updateCode,
    updateLanguage,
    others,
  } = useLiveblocksEditor(roomId);

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
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No file selected</p>
          <p className="text-sm mt-2">
            Open a file from the sidebar to start editing
          </p>
          {others > 0 && (
            <p className="text-sm mt-2 text-primary">
              {others} collaborator{others > 1 ? "s" : ""} online
            </p>
          )}
        </div>
      </div>
    );
  }

  const currentContent = getFileContent(activeFile);
  const language = getLanguageFromFile(activeFile);

  // Use Liveblocks code if available, otherwise use local content
  const editorValue = liveblocksCode || currentContent;

  const handleCodeChange = (newContent: string) => {
    updateCode(newContent);
    updateFileContent(activeFile, newContent);
  };

  return (
    <div className="h-full">
      {others > 0 && (
        <div className="px-4 py-2 bg-primary/10 border-b text-sm text-primary">
          {others} collaborator{others > 1 ? "s" : ""} online
        </div>
      )}
      <MonacoEditor
        value={editorValue}
        language={language}
        onChange={handleCodeChange}
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
