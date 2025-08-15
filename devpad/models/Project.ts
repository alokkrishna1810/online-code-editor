import mongoose, { type Document, Schema } from "mongoose";

export interface IFile {
  name: string;
  content: string;
  language: "html" | "css" | "javascript";
  path: string;
}

export interface IProject extends Document {
  _id: string;
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  collaborators: mongoose.Types.ObjectId[];
  files: IFile[];
  isPublic: boolean;
  template: string;
  createdAt: Date;
  updatedAt: Date;
  lastModified: Date;
}

const FileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  content: { type: String, default: "" },
  language: {
    type: String,
    enum: ["html", "css", "javascript"],
    required: true,
  },
  path: { type: String, required: true },
});

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    files: [FileSchema],
    isPublic: {
      type: Boolean,
      default: false,
    },
    template: {
      type: String,
      default: "blank",
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ owner: 1, createdAt: -1 });
ProjectSchema.index({ collaborators: 1 });
ProjectSchema.index({ isPublic: 1, createdAt: -1 });

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);
