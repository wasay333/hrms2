import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { db } from "../../../../lib/db";
import { currentUser } from "../../../../lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();

    if (!user || user.role !== UserRole.ADMIN) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { id } = await params;

    const employee = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        email: true,
        phone: true,
        position: true,
        bio: true,
        assignedProjects: {
          select: {
            id: true,
            workDetail: true,
            status: true,
            employeeDeadline: true,
            assignedAt: true,
            updatedAt: true,
            project: {
              select: {
                id: true,
                name: true,
                detail: true,
                mainDeadline: true,
              },
            },
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        attendances: {
          select: {
            id: true,
            date: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
