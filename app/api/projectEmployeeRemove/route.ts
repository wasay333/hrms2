import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { db } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user || user.role !== UserRole.ADMIN) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return new NextResponse("Project ID is required", { status: 400 });
    }

    // Get userIds already assigned to this project
    const assignedUsers = await db.userProject.findMany({
      where: { projectId },
      select: { userId: true },
    });

    const assignedUserIds = assignedUsers.map((entry) => entry.userId);

    // Get employees not assigned
    const employees = await db.user.findMany({
      where: {
        role: UserRole.EMPLOYEE,
        id: { in: assignedUserIds },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
