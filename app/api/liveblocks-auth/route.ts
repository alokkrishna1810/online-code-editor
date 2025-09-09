import { liveblocks } from "@/lib/liveblocks";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { room } = await request.json();

    if (!room) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // Get user info from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userInfo: {
      name: string;
      email: string;
      avatar?: string;
      theme: "system" | "light" | "dark";
      role: "editor" | "owner" | "viewer";
    } = {
      name: user.firstName + " " + user.lastName || user.username || "User",
      email: user.emailAddresses[0]?.emailAddress || "",
      avatar: user.imageUrl || undefined,
      theme: "system" as const,
      role: "editor" as const,
    };

    // Create a session for the user
    const session = liveblocks.prepareSession(user.id, {
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
