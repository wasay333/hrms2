"use server";
import { currentUser } from "../../lib/auth";
import { toZonedTime } from "date-fns-tz";
import { AttendanceStatus } from "@prisma/client";
import { db } from "../../lib/db";
import { z } from "zod";
import { createAttendanceSchema } from "../../schema";

export async function createAttendance(
  input: z.infer<typeof createAttendanceSchema>
) {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: "Unauthorized: User required" };
  }

  if (!input.confirm) {
    return { error: "You must confirm attendance." };
  }

  const nowUtc = new Date();
  const timeZone = "Asia/Karachi";
  const currentTime = toZonedTime(nowUtc, timeZone);

  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  const totalMinutes = hour * 60 + minute;

  let status: AttendanceStatus;

  if (totalMinutes >= 540 && totalMinutes <= 570) {
    status = AttendanceStatus.present;
  } else if (totalMinutes >= 571 && totalMinutes <= 690) {
    status = AttendanceStatus.late;
  } else {
    status = AttendanceStatus.half_time;
  }

  try {
    const existing = await db.attendance.findUnique({
      where: {
        unique_user_day_attendance: {
          userId: user.id,
          date: new Date(input.date),
        },
      },
    });

    if (existing) {
      throw new Error("Attendance already marked for this date.");
    }
    const attendance = await db.attendance.create({
      data: {
        userId: user.id,
        date: new Date(input.date), // from form input
        status: status,
      },
    });

    return { success: "Attendance marked successfully.", data: attendance };
  } catch (error) {
    console.error("Attendance creation error:", error);
    return {
      error:
        error && typeof error === "object" && "message" in error
          ? (error as { message?: string }).message ||
            "Something went wrong while marking attendance."
          : "Something went wrong while marking attendance.",
    };
  }
}
