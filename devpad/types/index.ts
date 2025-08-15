export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  isPublic: boolean;
  files: ProjectFile[];
  collaborators: Collaborator[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: "html" | "css" | "javascript" | "typescript" | "json";
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collaborator {
  id: string;
  userId: string;
  projectId: string;
  role: "owner" | "editor" | "viewer";
  user: User;
  createdAt: Date;
}

export interface CollaborationEvent {
  type:
    | "cursor"
    | "selection"
    | "edit"
    | "file-change"
    | "user-join"
    | "user-leave";
  userId: string;
  projectId: string;
  fileId?: string;
  data: any;
  timestamp: Date;
}

export interface CursorPosition {
  userId: string;
  fileId: string;
  line: number;
  column: number;
  color: string;
}

export interface FileEdit {
  fileId: string;
  content: string;
  changes: {
    range: {
      startLineNumber: number;
      startColumn: number;
      endLineNumber: number;
      endColumn: number;
    };
    text: string;
  }[];
}
