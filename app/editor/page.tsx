"use client";

import Header from "@/components/header/header";
import { EditorLayout } from "@/components/editor/editor-layout";
import { RoomProvider } from "@liveblocks/react";
import { LiveList } from "@liveblocks/client";

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
            language: "javascript"
          }}
          initialStorage={{
            code: "",
            language: "javascript",
            output: "",
            files: new LiveList([]),
            project: {
              name: "Untitled Project",
              type: "client-side",
              language: "javascript"
            }
          }}
        >
          <EditorLayout />
        </RoomProvider>
      </div>
    </div>
  );
}
