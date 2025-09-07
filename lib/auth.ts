import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import connectDB from "./mongodb";
import User, { type IUser } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const RESET_TOKEN_SECRET =
  process.env.RESET_TOKEN_SECRET || "reset-token-secret";

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Password strength requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
};

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

// Rate limiting functions
export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count++;
  return true;
}

export function resetRateLimit(identifier: string) {
  rateLimitStore.delete(identifier);
}

// Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(
      `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`
    );
  }

  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (
    PASSWORD_REQUIREMENTS.requireSpecialChars &&
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    errors.push("Password must contain at least one special character");
  }

  return { isValid: errors.length === 0, errors };
}

// Password reset functions
export async function generatePasswordResetToken(
  userId: string
): Promise<string> {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHmac("sha256", RESET_TOKEN_SECRET)
    .update(resetToken)
    .digest("hex");

  await connectDB();
  await User.findByIdAndUpdate(userId, {
    passwordResetToken: hashedToken,
    passwordResetExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  return resetToken;
}

export async function verifyPasswordResetToken(
  token: string
): Promise<IUser | null> {
  const hashedToken = crypto
    .createHmac("sha256", RESET_TOKEN_SECRET)
    .update(token)
    .digest("hex");

  await connectDB();
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  return user;
}

export async function resetPassword(
  userId: string,
  newPassword: string
): Promise<void> {
  const hashedPassword = await hashPassword(newPassword);

  await connectDB();
  await User.findByIdAndUpdate(userId, {
    password: hashedPassword,
    passwordResetToken: undefined,
    passwordResetExpires: undefined,
  });
}

// Email verification functions
export async function generateEmailVerificationToken(
  userId: string
): Promise<string> {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHmac("sha256", RESET_TOKEN_SECRET)
    .update(verificationToken)
    .digest("hex");

  await connectDB();
  await User.findByIdAndUpdate(userId, {
    emailVerificationToken: hashedToken,
    emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  return verificationToken;
}

export async function verifyEmail(token: string): Promise<IUser | null> {
  const hashedToken = crypto
    .createHmac("sha256", RESET_TOKEN_SECRET)
    .update(token)
    .digest("hex");

  await connectDB();
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (user) {
    await User.findByIdAndUpdate(user._id, {
      isEmailVerified: true,
      emailVerificationToken: undefined,
      emailVerificationExpires: undefined,
    });
  }

  return user;
}

// Refresh token functions
export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: "30d" });
}

export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// Session management
export async function invalidateUserSessions(userId: string): Promise<void> {
  // In a real implementation, you'd store session tokens in database
  // For now, we'll just log the action
  console.log(`Invalidating all sessions for user: ${userId}`);
}

export async function updateLastLogin(userId: string): Promise<void> {
  await connectDB();
  await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
}
