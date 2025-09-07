import { type NextRequest, NextResponse } from "next/server";
import {
  createUser,
  generateToken,
  generateRefreshToken,
  checkRateLimit,
  validatePasswordStrength,
  generateEmailVerificationToken,
} from "@/lib/auth";
import type { IUser } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Input validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    // Password strength validation
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(", ") },
        { status: 400 }
      );
    }

    // Rate limiting
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitKey = `register:${email}:${clientIP}`;

    if (!checkRateLimit(rateLimitKey, 3, 60 * 60 * 1000)) {
      // 3 attempts per hour
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    const user = await createUser(email, password, name);
    const token = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Generate email verification token
    const verificationToken = await generateEmailVerificationToken(
      user._id.toString()
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = (
      user as IUser & { toJSON(): any }
    ).toJSON();

    const response = NextResponse.json({
      user: userWithoutPassword,
      token,
      refreshToken,
      emailVerificationRequired: true,
      verificationToken, // In production, send this via email
    });

    // Set secure cookie for refresh token
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.message === "User already exists") {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
