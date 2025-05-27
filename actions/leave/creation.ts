"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createLeaveRequestSchema } from "../../schema";
import { db } from "../../lib/db";
import { currentUser } from "../../lib/auth";
import { LeaveStatus } from "@prisma/client";

export async function createLeaveRequest(
  values: z.infer<typeof createLeaveRequestSchema>
) {
  const user = await currentUser();

  if (!user || !user.id || user.role !== "EMPLOYEE") {
    throw new Error("Only employees can submit leave requests");
  }
  const validatedFields = createLeaveRequestSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid field" };
  }
  const { reason, fromDate, toDate, type } = validatedFields.data;
  const formattedToDate = new Date(toDate).toISOString();
  const formattedFromDate = new Date(fromDate).toISOString();

  try {
    const leaveRequest = await db.leaveRequest.create({
      data: {
        userId: user.id as string,
        reason: reason,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        type: type,
        status: LeaveStatus.pending,
      },
    });
    revalidatePath("/dashboard/leave-requests");
    return {
      success: "Leave created successfully.",
      leaveRequestId: leaveRequest.id,
    };
  } catch (error) {
    console.log("Error creating leave request:", error);
    return { error: "Failed to create leave request" };
  }
}
