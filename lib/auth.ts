import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "./mongodb";
import User, { type IUser } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<IUser> {
  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);
  const user = new User({
    email,
    password: hashedPassword,
    name,
  });

  await user.save();
  return user;
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  await connectDB();
  return User.findOne({ email });
}

export async function findUserById(id: string): Promise<IUser | null> {
  await connectDB();
  return User.findById(id).select("-password");
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<IUser | null> {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }

  return user;
}
