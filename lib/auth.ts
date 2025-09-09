import { currentUser } from "@clerk/nextjs/server";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function syncUserToDB(userId: string) {
  try {
    const User = (await import("../models/User")).default;
    const connectDB = (await import("../lib/mongodb")).default;

    await connectDB();

    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        user = new User({
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          name:
            clerkUser.firstName + " " + clerkUser.lastName ||
            clerkUser.username,
          avatar: clerkUser.imageUrl,
        });
        await user.save();
      }
    }
  } catch (error) {
    console.error("Error syncing user to DB:", error);
  }
}

export async function verifyTokenFromRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.substring(7);
    const payload = jwt.verify(token, JWT_SECRET);
    return payload as { userId: string };
  } catch (error) {
    return null;
  }
}
