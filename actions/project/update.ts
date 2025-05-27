"use server";

import { updateProjectSchema } from "../../schema";
import { currentUser } from "../../lib/auth";
import { db } from "../../lib/db";
import { z } from "zod";
import { GetUserById } from "../../data/user";

export async function updateProject(
  id: string,
  values: z.infer<typeof updateProjectSchema>
) {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") return { error: "Unauthorized" };

  const dbUser = await GetUserById(user.id as string);
  if (!dbUser || !dbUser.password) return { error: "Unauthorized" };
  const { detail, projectType } = values;
  const updated = await db.project.update({
    where: { id },
    data: {
      detail: detail,
      projectType: projectType,
    },
  });

  return updated;
}
