"use server";

import { ProjectStatus } from "@prisma/client";
import { currentUser } from "../../lib/auth";
import { db } from "../../lib/db";

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus
) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized", status: 401 };
  }

  const userId = user.id;

  if (!Object.values(ProjectStatus).includes(status)) {
    return { error: "Invalid status value", status: 400 };
  }

  const assignment = await db.userProject.findUnique({
    where: {
      user_project_unique: {
        userId: userId!,
        projectId,
      },
    },
  });

  if (!assignment) {
    return { error: "Project assignment not found", status: 404 };
  }

  const updatedAssignment = await db.userProject.update({
    where: {
      user_project_unique: {
        userId: userId!,
        projectId,
      },
    },
    data: {
      status,
    },
  });

  return { data: updatedAssignment, status: 200 };
}
