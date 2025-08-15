import { type NextRequest, NextResponse } from "next/server";
import { dockerExecutor } from "@/lib/docker-executor";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { language, code, input } = await request.json();

    if (!language || !code) {
      return NextResponse.json(
        { error: "Language and code are required" },
        { status: 400 }
      );
    }

    // Execute code
    const result = await dockerExecutor.executeCode(language, code, input);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Code execution error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Code execution failed",
        success: false,
      },
      { status: 500 }
    );
  }
}
