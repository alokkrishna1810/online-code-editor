import { liveblocks } from "@/lib/liveblocks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { room } = await request.json();

    if (!room) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // Get user info from session/token
    const userId = "anonymous"; // Replace with actual user ID from auth
    const userInfo = {
      name: "Anonymous User",
    };

    // Create a session for the user
    const session = liveblocks.prepareSession(userId, {
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
