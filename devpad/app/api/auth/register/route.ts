import { type NextRequest, NextResponse } from "next/server";
import { createUser, generateToken } from "@/lib/auth";
import type { IUser } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await createUser(email, password, name);
    const token = generateToken(user._id.toString());

    // Return user without password
    const { password: _, ...userWithoutPassword } = (
      user as IUser & { toJSON(): any }
    ).toJSON();

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.message === "User already exists") {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
