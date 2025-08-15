import type { CollaborationEvent, CursorPosition, FileEdit } from "@/types";

class CollaborationManager {
  private events: CollaborationEvent[] = [];
  private cursors: Map<string, CursorPosition> = new Map();
  private subscribers: Map<string, Set<(event: CollaborationEvent) => void>> =
    new Map();

  subscribe(projectId: string, callback: (event: CollaborationEvent) => void) {
    if (!this.subscribers.has(projectId)) {
      this.subscribers.set(projectId, new Set());
    }
    this.subscribers.get(projectId)!.add(callback);

    return () => {
      this.subscribers.get(projectId)?.delete(callback);
    };
  }

  broadcast(projectId: string, event: CollaborationEvent) {
    this.events.push(event);
    this.subscribers.get(projectId)?.forEach((callback) => callback(event));
  }

  updateCursor(projectId: string, cursor: CursorPosition) {
    const key = `${projectId}-${cursor.userId}`;
    this.cursors.set(key, cursor);

    this.broadcast(projectId, {
      type: "cursor",
      userId: cursor.userId,
      projectId,
      fileId: cursor.fileId,
      data: cursor,
      timestamp: new Date(),
    });
  }

  getCursors(projectId: string): CursorPosition[] {
    const cursors: CursorPosition[] = [];
    this.cursors.forEach((cursor, key) => {
      if (key.startsWith(projectId)) {
        cursors.push(cursor);
      }
    });
    return cursors;
  }

  applyEdit(projectId: string, userId: string, edit: FileEdit) {
    this.broadcast(projectId, {
      type: "edit",
      userId,
      projectId,
      fileId: edit.fileId,
      data: edit,
      timestamp: new Date(),
    });
  }

  userJoin(projectId: string, userId: string) {
    this.broadcast(projectId, {
      type: "user-join",
      userId,
      projectId,
      data: { userId },
      timestamp: new Date(),
    });
  }

  userLeave(projectId: string, userId: string) {
    // Remove user's cursor
    const key = `${projectId}-${userId}`;
    this.cursors.delete(key);

    this.broadcast(projectId, {
      type: "user-leave",
      userId,
      projectId,
      data: { userId },
      timestamp: new Date(),
    });
  }
}

export const collaborationManager = new CollaborationManager();
