"use client";

import Header from "@/components/header/header";
import { EditorLayout } from "@/components/editor/editor-layout";
import { RoomProvider } from "@liveblocks/react";
import { LiveList, LiveObject } from "@liveblocks/client";
import { FileSystemItem } from "@/liveblocks.config"; // Import the LiveObject type

// Initial files must be created as LiveObjects to match the storage type
const defaultFiles: FileSystemItem[] = [
  new LiveObject({
    type: "file",
    name: "index.html",
    path: "index.html",
    language: "html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CodeCollab Preview</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello from CodeCollab!</h1>
    <p>Your collaborative editor is working.</p>
    <script src="script.js"></script>
</body>
</html>`,
  }),
  new LiveObject({
    type: "file",
    name: "style.css",
    path: "style.css",
    language: "css",
    content: `body { 
  font-family: sans-serif; 
  background-color: #f4f4f9;
  color: #333;
  padding: 2rem;
}`,
  }),
  new LiveObject({
    type: "file",
    name: "script.js",
    path: "script.js",
    language: "javascript",
    content: `console.log('Hello from CodeCollab!');`,
  }),
];

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-[calc(100vh-4rem)]">
        <RoomProvider
          id="editor-room"
          initialPresence={{
            cursor: null,
            selection: null,
            color: "#3b82f6",
            currentFile: "index.html",
          }}
          initialStorage={{
            files: new LiveList(defaultFiles),
          }}
        >
          <EditorLayout />
        </RoomProvider>
      </div>
    </div>
  );
}
