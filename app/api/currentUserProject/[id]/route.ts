import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { currentUser } from "../../../../lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { id } = await params;

    const project = await db.project.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        assignments: {
          where: {
            userId: user.id,
          },
          select: {
            employeeDeadline: true,
            assignedAt: true,
            status: true,
            user: {
              select: {
                name: true,
              },
            },
            admin: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
