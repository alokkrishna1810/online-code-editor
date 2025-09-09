"use client";

import { useState, useCallback } from "react";
import { useStorage, useMutation } from "@liveblocks/react";
import { LiveList, LiveObject } from "@liveblocks/client";
import {
  FileSystemItem,
  FileSystemItemObject,
  FileSystemItemSnapshot,
} from "@/liveblocks.config";

export function useFileSystem() {
  const [openFiles, setOpenFiles] = useState<string[]>(["index.html"]);
  const [activeFile, setActiveFile] = useState<string | null>("index.html");

  // ✅ This gives you a snapshot array of plain objects
  const files = useStorage((root) => root.files) as FileSystemItemSnapshot[];

  // --- Mutations (edit LiveObjects) ---
  const createFile = useMutation(
    (
      { storage },
      parentPath: string,
      name: string,
      content = "",
      language = "plaintext"
    ) => {
      const newFile = new LiveObject<FileSystemItemObject>({
        type: "file",
        name,
        path: parentPath ? `${parentPath}/${name}` : name,
        content,
        language,
      });
      storage.get("files").push(newFile as unknown as FileSystemItem);
    },
    []
  );

  const createFileFromTemplate = useMutation(
    ({ storage }, name: string, content: string) => {
      const extension = name.split(".").pop() || "";
      const language = extension === "js" ? "javascript" : extension;
      const newFile = new LiveObject<FileSystemItemObject>({
        type: "file",
        name,
        path: name,
        content,
        language,
      });
      storage.get("files").push(newFile as unknown as FileSystemItem);
    },
    []
  );

  const createFolder = useMutation(
    ({ storage }, parentPath: string, name: string) => {
      const newFolder = new LiveObject<FileSystemItemObject>({
        type: "folder",
        name,
        path: parentPath ? `${parentPath}/${name}` : name,
        children: new LiveList([]),
      });
      storage.get("files").push(newFolder as unknown as FileSystemItem);
    },
    []
  );

  const updateFileContent = useMutation(
    ({ storage }, path: string, content: string) => {
      const fileList = storage.get("files");
      const file = fileList.find((f) => f.get("path") === path);
      if (file && file.get("type") === "file") {
        file.set("content", content);
      }
    },
    []
  );

  const deleteItem = useMutation(({ storage }, path: string) => {
    const fileList = storage.get("files");
    const index = fileList.findIndex((f) => f.get("path") === path);
    if (index !== -1) {
      fileList.delete(index);
    }
  }, []);

  const renameItem = useMutation(
    ({ storage }, path: string, newName: string) => {
      const fileList = storage.get("files");
      const file = fileList.find((f) => f.get("path") === path);
      if (file) {
        const oldPath = file.get("path");
        const newPath =
          oldPath.substring(0, oldPath.lastIndexOf("/") + 1) + newName;
        file.set("name", newName);
        file.set("path", newPath);
      }
    },
    []
  );

  // --- Utilities for snapshots ---
  const getFile = useCallback(
    (path: string | null): FileSystemItemSnapshot | null => {
      if (!files || !path) return null;
      return files.find((f) => f.path === path) ?? null;
    },
    [files]
  );

  const getFilesForPreview = useCallback(() => {
    if (!files) return { "index.html": "", "style.css": "", "script.js": "" };
    const fileMap: { [key: string]: string } = {};
    files.forEach((file) => {
      if (file.type === "file" && typeof file.content === "string") {
        fileMap[file.name] = file.content;
      }
    });
    return fileMap;
  }, [files]);

  const openFileHandler = useCallback(
    (path: string) => {
      if (!openFiles.includes(path)) {
        setOpenFiles((prev) => [...prev, path]);
      }
      setActiveFile(path);
    },
    [openFiles]
  );

  const closeFileHandler = useCallback(
    (path: string) => {
      const newOpenFiles = openFiles.filter((file) => file !== path);
      setOpenFiles(newOpenFiles);
      if (activeFile === path) {
        setActiveFile(newOpenFiles[0] || null);
      }
    },
    [activeFile, openFiles]
  );

  return {
    files,
    openFiles,
    activeFile,
    createFile,
    createFolder,
    renameItem,
    deleteItem,
    updateFileContent,
    openFile: openFileHandler,
    closeFile: closeFileHandler,
    setActiveFile,
    getFile,
    getFilesForPreview,
    createFileFromTemplate,
  };
}
