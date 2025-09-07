import { type NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  generateToken,
  generateRefreshToken,
  checkRateLimit,
  resetRateLimit,
  updateLastLogin,
  validatePasswordStrength,
} from "@/lib/auth";
import type { IUser } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password strength validation on login (optional, can be removed if not desired)
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
    const rateLimitKey = `login:${email}:${clientIP}`;

    if (!checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
      // 5 attempts per 15 minutes
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Reset rate limit on successful login
    resetRateLimit(rateLimitKey);

    // Update last login
    await updateLastLogin(user._id.toString());

    const token = generateToken(user._id.toString());
    const refreshToken = rememberMe
      ? generateRefreshToken(user._id.toString())
      : null;

    const userDoc = user as IUser & { toJSON(): any };
    const { password: _, ...userWithoutPassword } = userDoc.toJSON();

    const response = NextResponse.json({
      user: userWithoutPassword,
      token,
      refreshToken,
    });

    // Set secure cookie for refresh token if remember me is checked
    if (refreshToken) {
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
