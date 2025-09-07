"use client";

import { Button } from "@/components/ui/button";
import { X, FileText, Palette, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { useFileSystem } from "@/hooks/use-file-system";

interface EditorTabsProps {
  fileSystem: ReturnType<typeof useFileSystem>;
}

export function EditorTabs({ fileSystem }: EditorTabsProps) {
  const { openFiles, activeFile, setActiveFile, closeFile } = fileSystem;

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".html")) return FileText;
    if (fileName.endsWith(".css")) return Palette;
    if (fileName.endsWith(".js")) return Zap;
    return FileText;
  };

  const getFileName = (path: string) => {
    return path.split("/").pop() || path;
  };

  if (openFiles.length === 0) {
    return (
      <div className="border-b bg-card/30 backdrop-blur h-10 flex items-center justify-center text-sm text-muted-foreground">
        No files open
      </div>
    );
  }

  return (
    <div className="border-b bg-card/30 backdrop-blur">
      <div className="flex items-center overflow-x-auto">
        {openFiles.map((filePath) => {
          const fileName = getFileName(filePath);
          const Icon = getFileIcon(fileName);
          return (
            <div
              key={filePath}
              className={cn(
                "flex items-center px-3 py-2 border-r cursor-pointer hover:bg-accent/50 group min-w-0",
                activeFile === filePath &&
                  "bg-background border-b-2 border-b-primary"
              )}
              onClick={() => setActiveFile(filePath)}
            >
              <Icon className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
              <span className="text-sm truncate">{fileName}</span>

              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2 opacity-0 group-hover:opacity-100 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(filePath);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
