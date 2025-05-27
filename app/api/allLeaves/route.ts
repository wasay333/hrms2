import { NextResponse } from "next/server";
import { currentUser } from "../../../lib/auth";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const leaves = await db.leaveRequest.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            name: true,
            email: true, // Add more fields as needed
          },
        },
      },
    });

    return NextResponse.json(leaves);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
