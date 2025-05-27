"use server";

import { currentUser } from "../../lib/auth";
import { db } from "../../lib/db";

interface RemoveEmployeeParams {
  projectId: string;
  userId: string;
}

export const removeEmployeeFromProject = async ({
  projectId,
  userId,
}: RemoveEmployeeParams) => {
  const user = await currentUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized." };
  }

  try {
    await db.userProject.deleteMany({
      where: {
        projectId,
        userId,
      },
    });

    return { success: "Employee successfully removed from project." };
  } catch (error) {
    console.error("Remove Employee Error:", error);
    return { error: "Failed to remove employee from project." };
  }
};
