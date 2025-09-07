"use client";

import type React from "react";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Folder, Copy, Scissors, Trash2, Edit } from "lucide-react";

interface FileContextMenuProps {
  children: React.ReactNode;
  item: any;
  onCreateFile: (parentPath: string, name: string) => void;
  onCreateFolder: (parentPath: string, name: string) => void;
  onRename: (path: string, newName: string) => void;
  onDelete: (path: string) => void;
  onCopy: (path: string) => void;
  onCut: (path: string) => void;
}

export function FileContextMenu({
  children,
  item,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
  onCopy,
  onCut,
}: FileContextMenuProps) {
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [createType, setCreateType] = useState<"file" | "folder">("file");
  const [newName, setNewName] = useState("");

  const handleRename = () => {
    if (newName.trim()) {
      onRename(item.path, newName.trim());
      setShowRenameDialog(false);
      setNewName("");
    }
  };

  const handleCreate = () => {
    if (newName.trim()) {
      const parentPath =
        item.type === "folder"
          ? item.path
          : item.path.split("/").slice(0, -1).join("/") || "";
      if (createType === "file") {
        onCreateFile(parentPath, newName.trim());
      } else {
        onCreateFolder(parentPath, newName.trim());
      }
      setShowCreateDialog(false);
      setNewName("");
    }
  };

  const handleDelete = () => {
    onDelete(item.path);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

        <ContextMenuContent className="w-48">
          {item.type === "folder" && (
            <>
              <ContextMenuItem
                onClick={() => {
                  setCreateType("file");
                  setShowCreateDialog(true);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                New File
              </ContextMenuItem>

              <ContextMenuItem
                onClick={() => {
                  setCreateType("folder");
                  setShowCreateDialog(true);
                }}
              >
                <Folder className="h-4 w-4 mr-2" />
                New Folder
              </ContextMenuItem>

              <ContextMenuSeparator />
            </>
          )}
          <ContextMenuItem
            onClick={() => {
              setNewName(item.name);
              setShowRenameDialog(true);
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Rename
          </ContextMenuItem>

          <ContextMenuItem onClick={() => onCopy(item.path)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </ContextMenuItem>

          <ContextMenuItem onClick={() => onCut(item.path)}>
            <Scissors className="h-4 w-4 mr-2" />
            Cut
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {item.type}</DialogTitle>

            <DialogDescription>
              Enter a new name for this {item.type}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rename-input">Name</Label>
              <Input
                id="rename-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
                placeholder={`Enter ${item.type} name`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRenameDialog(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleRename} disabled={!newName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New {createType}</DialogTitle>

            <DialogDescription>
              Enter a name for the new {createType}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-input">Name</Label>
              <Input
                id="create-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder={`Enter ${createType} name`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleCreate} disabled={!newName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {item.type}</DialogTitle>

            <DialogDescription>
              Are you sure you want to delete "{item.name}"? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>

            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
