import { NextResponse } from "next/server";
import { currentUser } from "../../../lib/auth";
import { db } from "../../../lib/db";

export async function GET() {
  const user = await currentUser();

  if (!user || !user.id || user.role !== "EMPLOYEE") {
    return NextResponse.json(
      { error: "Unauthorized or invalid user" },
      { status: 401 }
    );
  }

  try {
    const balance = await db.leaveBalance.findUnique({
      where: { userId: user.id },
    });

    if (!balance) {
      return NextResponse.json(
        { error: "Leave balance not found for user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      total: balance.total,
      used: balance.used,
      remaining: balance.remaining,
    });
  } catch (error) {
    console.error("Error fetching leave balance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
