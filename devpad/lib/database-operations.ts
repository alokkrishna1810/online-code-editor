import connectDB from "./mongodb"
import User from "@/models/User"
import Project from "@/models/Project"
import Collaboration from "@/models/Collaboration"
import type { IUser, IProject, ICollaborationSession } from "@/models"

export class DatabaseOperations {
  async init() {
    await connectDB()
  }

  // User operations
  async createUser(email: string, password: string, name: string): Promise<IUser> {
    await this.init()
    const user = new User({ email, password, name })
    return await user.save()
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    await this.init()
    return await User.findOne({ email }).exec()
  }

  async getUserById(id: string): Promise<IUser | null> {
    await this.init()
    return await User.findById(id).exec()
  }

  // Project operations
  async createProject(name: string, description: string, ownerId: string, template = "blank"): Promise<IProject> {
    await this.init()
    const project = new Project({
      name,
      description,
      owner: ownerId,
      template,
      files: [],
    })
    return await project.save()
  }

  async getProjectsByUserId(userId: string): Promise<IProject[]> {
    await this.init()
    return await Project.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    })
      .populate("owner", "name email avatar")
      .exec()
  }

  async getProjectById(id: string): Promise<IProject | null> {
    await this.init()
    return await Project.findById(id)
      .populate("owner", "name email avatar")
      .populate("collaborators", "name email avatar")
      .exec()
  }

  async updateProject(id: string, updates: Partial<IProject>): Promise<IProject | null> {
    await this.init()
    return await Project.findByIdAndUpdate(id, { ...updates, lastModified: new Date() }, { new: true }).exec()
  }

  async deleteProject(id: string): Promise<boolean> {
    await this.init()
    const result = await Project.findByIdAndDelete(id).exec()
    return !!result
  }

  // Collaboration operations
  async createCollaborationSession(projectId: string): Promise<ICollaborationSession> {
    await this.init()
    const session = new Collaboration({
      projectId,
      participants: [],
      isActive: true,
    })
    return await session.save()
  }

  async getActiveCollaborationSession(projectId: string): Promise<ICollaborationSession | null> {
    await this.init()
    return await Collaboration.findOne({
      projectId,
      isActive: true,
    })
      .populate("participants.userId", "name email avatar")
      .exec()
  }
}

export const db = new DatabaseOperations()
