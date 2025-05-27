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

  const leaveDays = calculateLeaveDays(leave.fromDate, leave.toDate);

  const balance = await db.leaveBalance.findUnique({
    where: { userId: leave.userId },
  });

  if (!balance || balance.remaining < leaveDays) {
    throw new Error("Insufficient leave balance");
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
