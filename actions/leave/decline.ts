"use server";

import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";

export async function declineLeave(leaveId: string) {
  const leave = await db.leaveRequest.findUnique({
    where: { id: leaveId },
  });

  if (!leave || leave.status !== "pending") {
    throw new Error("Invalid leave request");
  }

  await db.leaveRequest.update({
    where: { id: leaveId },
    data: { status: "declined" },
  });

  revalidatePath("/dashboard/leaves");
}
