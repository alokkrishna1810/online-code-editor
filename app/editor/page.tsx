"use client";

import Header from "@/components/header/header";
import { EditorLayout } from "@/components/editor/editor-layout";
import { RoomProvider } from "@liveblocks/react";
import { LiveList, LiveObject } from "@liveblocks/client";
import { FileSystemItem, FileSystemItemObject } from "@/liveblocks.config";

// ✅ Create a function that returns new LiveObjects each time it's called
const getInitialStorage = () => ({
  files: new LiveList<FileSystemItem>([
    new LiveObject<FileSystemItemObject>({
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
    new LiveObject<FileSystemItemObject>({
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
    new LiveObject<FileSystemItemObject>({
      type: "file",
      name: "script.js",
      path: "script.js",
      language: "javascript",
      content: `console.log('Hello from CodeCollab!');`,
    }),
  ]),
});


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
          // ✅ Call the function to get fresh initial storage on each render
          initialStorage={getInitialStorage}
        >
          <EditorLayout />
        </RoomProvider>
      </div>
    </div>
  );
}