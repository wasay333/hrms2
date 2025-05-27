"use server";
import { currentUser } from "../lib/auth";
import { db } from "../lib/db";
import { z } from "zod";
import { todayWorkSchema } from "../schema";

export async function TodayWorkCreation(
  values: z.infer<typeof todayWorkSchema>
) {
  try {
    const user = await currentUser();

    if (!user || user.role !== "EMPLOYEE" || !user.id) {
      return { error: "Unauthorized", status: 401 };
    }

    const validated = todayWorkSchema.safeParse(values);

    if (!validated.success) {
      return { error: "Invalid field", status: 400 };
    }

    const { task } = validated.data;

    // Get start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Check if a task already exists for today
    const existingTask = await db.todayTask.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingTask) {
      return {
        error: "You have already submitted a task for today.",
        status: 409,
      };
    }

    const log = await db.todayTask.create({
      data: {
        userId: user.id,
        task,
      },
    });

    return { success: "Task created successfully", log };
  } catch (err) {
    console.error("Error creating task:", err);
    return { error: "Internal Server Error", status: 500 };
  }
}
