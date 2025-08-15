import mongoose, { type Document, Schema } from "mongoose";

export interface ICollaborationSession extends Document {
  _id: string;
  projectId: mongoose.Types.ObjectId;
  participants: {
    userId: mongoose.Types.ObjectId;
    socketId: string;
    cursor?: {
      line: number;
      column: number;
    };
    selection?: {
      startLine: number;
      startColumn: number;
      endLine: number;
      endColumn: number;
    };
    joinedAt: Date;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CollaborationSchema = new Schema<ICollaborationSession>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    participants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        socketId: {
          type: String,
          required: true,
        },
        cursor: {
          line: Number,
          column: Number,
        },
        selection: {
          startLine: Number,
          startColumn: Number,
          endLine: Number,
          endColumn: Number,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

CollaborationSchema.index({ projectId: 1, isActive: 1 });
CollaborationSchema.index({ "participants.userId": 1 });

export default mongoose.models.Collaboration ||
  mongoose.model<ICollaborationSession>("Collaboration", CollaborationSchema);
