import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }

    const simplifiedAssignments = await db.userProject.findMany({
      where: {
        userId: user.id,
      },
      select: {
        employeeDeadline: true,
        projectId: true,
        status: true,
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    });

    return NextResponse.json(simplifiedAssignments);
  } catch (error) {
    console.error("Failed to fetch simplified employee projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
