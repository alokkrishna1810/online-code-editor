import { LiveList, LiveObject, LsonObject } from "@liveblocks/client";

// This describes the LiveObject structure in storage
export type FileSystemItemObject = {
  type: "file" | "folder";
  name: string;
  path: string;
  children?: LiveList<FileSystemItem>;
  content?: string;
  language?: string;
};

// This is the actual LiveObject type
export type FileSystemItem = LiveObject<FileSystemItemObject>;

// This describes a *snapshot* shape returned by `useStorage`
// (basically JSON-serializable objects instead of LiveObjects)
export type FileSystemItemSnapshot = Omit<FileSystemItemObject, "children"> & {
  children?: FileSystemItemSnapshot[];
};

declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
      selection: { start: number; end: number } | null;
      color: string;
      currentFile: string | null;
    };

    Storage: {
      files: LiveList<FileSystemItem>;
    };

    UserMeta: {
      id: string;
      info: {
        name: string;
        email: string;
        avatar?: string;
        theme: "light" | "dark" | "system";
        role: "owner" | "editor" | "viewer";
      };
    };

    RoomEvent: any;
    ThreadMetadata: { x: number; y: number };
    RoomInfo: undefined;
  }
}

export {};
