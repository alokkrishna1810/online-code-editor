import { type NextRequest, NextResponse } from "next/server";
import {
  findUserByEmail,
  generatePasswordResetToken,
  checkRateLimit,
} from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Rate limiting for password reset requests
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitKey = `forgot-password:${email}:${clientIP}`;

    if (!checkRateLimit(rateLimitKey, 3, 60 * 60 * 1000)) {
      // 3 attempts per hour
      return NextResponse.json(
        { error: "Too many password reset requests. Please try again later." },
        { status: 429 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        message:
          "If an account with this email exists, a password reset link has been sent.",
      });
    }

    const resetToken = await generatePasswordResetToken(user._id.toString());

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetToken, user.name);

      return NextResponse.json({
        message:
          "If an account with this email exists, a password reset link has been sent.",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
