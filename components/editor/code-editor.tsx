"use client";

import { MonacoEditor } from "./monaco-editor";
import { useTheme } from "next-themes";
import type { useFileSystem } from "@/hooks/use-file-system";
import { FileText } from "lucide-react";
import { useOthers } from "@liveblocks/react";

interface CodeEditorProps {
  fileSystem: ReturnType<typeof useFileSystem>;
  theme: string;
}

export function CodeEditor({ fileSystem, theme }: CodeEditorProps) {
  const { activeFile, getFile, updateFileContent } = fileSystem;

  const others = useOthers();
  // ✅ getFile correctly returns a plain snapshot object
  const activeFileObject = getFile(activeFile);

  if (!activeFileObject) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No file selected</p>
        </div>
      </div>
    );
  }

  const handleCodeChange = (newContent: string | undefined) => {
    if (newContent !== undefined && activeFile) {
      updateFileContent(activeFile, newContent);
    }
  };

  return (
    <div className="h-full relative">
      <MonacoEditor
        value={activeFileObject.content || ""}
        language={activeFileObject.language || "plaintext"}
        onChange={handleCodeChange}
        theme={theme}
      />
    </div>
  );
}
