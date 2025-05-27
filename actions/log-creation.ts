"use server";
import { currentUser } from "../lib/auth";
import { db } from "../lib/db";
import { z } from "zod";
import { TimeLogFormSchema } from "../schema";

export async function LogCreation(values: z.infer<typeof TimeLogFormSchema>) {
  try {
    const user = await currentUser();

    if (!user || user.role !== "EMPLOYEE" || !user.id) {
      return { error: "Unauthorized", status: 401 };
    }

    const validated = TimeLogFormSchema.safeParse(values);

    if (!validated.success) {
      return { error: "Invalid field", status: 400 };
    }

    const { projectId, date, hoursWorked } = validated.data;
    const formattedDate = new Date(date).toISOString();

    const log = await db.projectTimeLog.create({
      data: {
        userId: user.id,
        projectId,
        date: formattedDate,
        hoursWorked: parseFloat(hoursWorked),
      },
    });

    return { success: "Log created successfully", log };
  } catch (err) {
    console.error("Error creating time log:", err);
    return { error: "Internal Server Error", status: 500 };
  }
}
