import { type NextRequest, NextResponse } from "next/server";
import {
  verifyPasswordResetToken,
  resetPassword,
  validatePasswordStrength,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(", ") },
        { status: 400 }
      );
    }

    const user = await verifyPasswordResetToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    await resetPassword(user._id.toString(), newPassword);

    return NextResponse.json({
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
