import { NextResponse } from "next/server";
import { dockerExecutor } from "@/lib/docker-executor";

export async function GET() {
  try {
    const languages = await dockerExecutor.getAvailableLanguages();
    return NextResponse.json({ languages });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get available languages" },
      { status: 500 }
    );
  }
}
