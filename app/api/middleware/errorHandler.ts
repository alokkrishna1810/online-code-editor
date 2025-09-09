import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function errorHandler(err: unknown) {
  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Invalid input",
        issues: err.issues,
      },
      { status: 400 }
    );
  }

  if (err instanceof Error) {
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: "An unknown error occurred",
    },
    { status: 500 }
  );
}