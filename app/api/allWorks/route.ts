import { NextResponse } from "next/server";
import { currentUser } from "../../../lib/auth";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await db.todayTask.findMany({
      select: {
        id: true,
        task: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const transformedTasks = tasks.map((task) => ({
      id: task.id,
      task: task.task,
      userName: task.user.name,
      userEmail: task.user.email,
    }));

    return NextResponse.json(transformedTasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
