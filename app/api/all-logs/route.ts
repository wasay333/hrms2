import { NextResponse } from "next/server";
import { currentUser } from "../../../lib/auth";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await db.projectTimeLog.findMany({
      select: {
        id: true,
        date: true,
        hoursWorked: true,
        user: {
          select: {
            name: true,
          },
        },
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Transform the data to flatten the structure
    const transformedLogs = logs.map((log) => ({
      id: log.id,
      date: log.date,
      hoursWorked: log.hoursWorked,
      userName: log.user.name,
      projectName: log.project.name,
    }));

    return NextResponse.json(transformedLogs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
