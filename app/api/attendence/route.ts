import { NextResponse } from "next/server";
import { currentUser } from "../../../lib/auth";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const attendanceRecords = await db.attendance.findMany({
      where: { userId: user.id },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(attendanceRecords, { status: 200 });
  } catch (error) {
    console.error("[ATTENDANCE_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
