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
    const leave = await db.leaveRequest.findUnique({
      where: {
        id: id,
      },
    });

    if (!leave) {
      return new NextResponse("project not found", { status: 404 });
    }

    return NextResponse.json(leave);
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
