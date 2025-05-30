"use server";

import { db } from "../../lib/db";
import { calculateLeaveDays } from "../../lib/utils";
import { revalidatePath } from "next/cache";

export async function approveLeave(leaveId: string) {
  const leave = await db.leaveRequest.findUnique({
    where: { id: leaveId },
  });

  if (!leave || leave.status !== "pending") {
    throw new Error("Invalid leave request");
  }
  // Convert string dates back to Date objects if needed
  const fromDate = new Date(leave.fromDate);
  const toDate = new Date(leave.toDate);

  const leaveDays = calculateLeaveDays(fromDate, toDate);
  console.log(
    `Leave days calculated: ${leaveDays} for period ${fromDate.toDateString()} to ${toDate.toDateString()}`
  );

  const balance = await db.leaveBalance.findUnique({
    where: { userId: leave.userId },
  });

  if (!balance || balance.remaining < leaveDays) {
    throw new Error("Insufficient leave balance of employee");
  }

  await db.$transaction([
    db.leaveRequest.update({
      where: { id: leaveId },
      data: { status: "approved" },
    }),
    db.leaveBalance.update({
      where: { userId: leave.userId },
      data: {
        used: { increment: leaveDays },
        remaining: { decrement: leaveDays },
      },
    }),
  ]);

  revalidatePath("/dashboard/leaves");
}
