"use server";

import { ProjectStatus } from "@prisma/client";
import { currentUser } from "../../lib/auth";
import { assignProjectSchema } from "../../schema";
import { db } from "../../lib/db";

interface AssignEmployeeParams {
  projectId: string;
  userId: string;
  values: {
    workDetail: string;
    employeeDeadline: string;
  };
}

export const assignEmployeeToProject = async ({
  projectId,
  userId,
  values,
}: AssignEmployeeParams) => {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized." };
  }

  const validatedFields = assignProjectSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid data provided." };
  }

  const { workDetail, employeeDeadline } = validatedFields.data;
  const formattedDeadline = new Date(employeeDeadline).toISOString();
  try {
    await db.userProject.create({
      data: {
        userId,
        projectId,
        assignedBy: user.id!,
        assignedAt: new Date(),
        workDetail,
        employeeDeadline: formattedDeadline,
        status: ProjectStatus.in_progress,
      },
    });

    return { success: "Employee successfully assigned to project." };
  } catch (error) {
    console.error("Assignment Error:", error);
    return { error: "Failed to assign employee to project." };
  }
};
