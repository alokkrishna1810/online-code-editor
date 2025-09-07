// Define Liveblocks types for CodeCollab collaborative code editor
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
import { LiveList } from "@liveblocks/client";

declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Real-time cursor coordinates for collaborative editing
      cursor: { x: number; y: number } | null;
      // User selection in the editor
      selection: { start: number; end: number } | null;
      // User's current color for cursor/avatar
      color: string;
      // User's current language being edited
      language: string;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // Collaborative code content
      code: string;
      // Programming language
      language: string;
      // Code execution results
      output: string;
      // File structure for multi-file projects
      files: LiveList<{
        name: string;
        content: string;
        language: string;
        isActive: boolean;
      }>;
      // Project metadata
      project: {
        name: string;
        type: "server-side" | "client-side";
        language: "cpp" | "java" | "python" | "javascript" | "typescript";
      };
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        // Authenticated user properties
        name: string;
        email: string;
        avatar?: string;
        // User preferences
        theme: "light" | "dark" | "system";
        // User's role in the room
        role: "owner" | "editor" | "viewer";
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent:
      | {
          // Code execution events
          type: "CODE_EXECUTED";
          output: string;
          language: string;
        }
      | {
          // File change events
          type: "FILE_CHANGED";
          fileName: string;
          action: "created" | "updated" | "deleted";
        }
      | {
          // User joined/left events
          type: "USER_ACTIVITY";
          userId: string;
          action: "joined" | "left";
        };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Code comment coordinates
      x: number;
      y: number;
      // Associated code range
      startLine: number;
      endLine: number;
      // Comment type
      type: "question" | "suggestion" | "bug" | "general";
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Project information
      name: string;
      description?: string;
      // Project type and language
      type: "server-side" | "client-side";
      language: "cpp" | "java" | "python" | "javascript" | "typescript";
      // Room settings
      isPublic: boolean;
      maxUsers: number;
      // Timestamps
      createdAt: Date;
      lastActivity: Date;
    };
  }
}

export {};
