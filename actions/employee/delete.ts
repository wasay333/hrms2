"use server";

import { GetUserById } from "../../data/user";
import { currentUser } from "../../lib/auth";
import { db } from "../../lib/db";

export async function deleteEmployee(id: string) {
  const user = await currentUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  const dbUser = await GetUserById(user.id as string);
  if (!dbUser || !dbUser.password) return { error: "Unauthorized" };

  try {
    const deleted = await db.user.delete({
      where: { id, role: "EMPLOYEE" },
    });

    return { success: true, data: deleted };
  } catch (error) {
    console.error("Failed to delete employee:", error);
    return { error: "Failed to delete employee. It may not exist." };
  }
}
