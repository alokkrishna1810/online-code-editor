"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
  FolderOpen,
  Plus,
  Search,
  PanelLeftClose,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FileContextMenu } from "./file-context-menu";
import type { useFileSystem } from "@/hooks/use-file-system";
import type { FileSystemItemSnapshot } from "@/liveblocks.config";

interface EditorSidebarProps {
  onCollapse: () => void;
  fileSystem: ReturnType<typeof useFileSystem>;
}

export function EditorSidebar({ onCollapse, fileSystem }: EditorSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const {
    files,
    createFile,
    createFolder,
    renameItem,
    deleteItem,
    openFile,
    activeFile,
  } = fileSystem;

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  // ✅ Access properties directly on the snapshot object
  const filteredFiles = files
    ? files.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // ✅ The 'items' parameter is now correctly typed as a snapshot array
  const renderFileTree = (
    items: readonly FileSystemItemSnapshot[],
    level = 0
  ) => {
    return items.map((item) => {
      return (
        <div key={item.path}>
          <FileContextMenu
            item={item} // ✅ Pass the plain snapshot object directly
            onCreateFile={createFile}
            onCreateFolder={createFolder}
            onRename={renameItem}
            onDelete={deleteItem}
            onCopy={() => {}}
            onCut={() => {}}
          >
            <div
              className={cn(
                "flex items-center px-2 py-1 text-sm cursor-pointer hover:bg-accent/50 rounded-sm group",
                activeFile === item.path && "bg-accent text-accent-foreground"
              )}
              style={{ paddingLeft: `${8 + level * 16}px` }}
              onClick={() => {
                if (item.type === "folder") {
                  toggleFolder(item.path);
                } else {
                  openFile(item.path);
                }
              }}
            >
              {item.type === "folder" ? (
                <>
                  {expandedFolders.has(item.path) ? (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1" />
                  )}
                  {expandedFolders.has(item.path) ? (
                    <FolderOpen className="h-4 w-4 mr-2 text-primary" />
                  ) : (
                    <Folder className="h-4 w-4 mr-2 text-primary" />
                  )}
                </>
              ) : (
                <FileText className="h-4 w-4 mr-2 ml-5 text-muted-foreground" />
              )}
              <span className="flex-1 truncate">{item.name}</span>
            </div>
          </FileContextMenu>
          {item.type === "folder" &&
            expandedFolders.has(item.path) &&
            item.children && (
              // ✅ The children are already a plain array, so just recurse
              <div>{renderFileTree(item.children, level + 1)}</div>
            )}
        </div>
      );
    });
  };

  return (
    <div className="h-full bg-sidebar border-r flex flex-col">
      <div className="p-3 border-b bg-sidebar/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm font-space-grotesk">Explorer</h2>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => createFile("", "untitled.txt")}
              title="New File"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={onCollapse}
              title="Collapse"
            >
              <PanelLeftClose className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-8 text-xs bg-background/50"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {files && renderFileTree(filteredFiles)}
        </div>
      </ScrollArea>
    </div>
  );
}
