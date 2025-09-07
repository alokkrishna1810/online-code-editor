import { liveblocks } from "@/lib/liveblocks";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, findUserById } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { room } = await request.json();

    if (!room) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get user info from database
    const user = await findUserById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userInfo: {
      name: string;
      email: string;
      avatar?: string;
      theme: "system" | "light" | "dark";
      role: "editor" | "owner" | "viewer";
    } = {
      name: user.name,
      email: user.email,
      avatar: user.avatar || undefined,
      theme: "system" as const, // Explicitly type as const to match union type
      role: "editor" as const, // Explicitly type as const to match union type
    };

    // Create a session for the user
    const session = liveblocks.prepareSession(decoded.userId, {
      userInfo,
    });

    // Allow the user to access the room
    session.allow(room, session.FULL_ACCESS);

    // Authorize the user and return the result
    const { status, body } = await session.authorize();

    return new NextResponse(body, { status });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
