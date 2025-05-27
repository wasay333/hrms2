"use server";

import { MainStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createProjectSchema } from "../../schema";
import { currentUser } from "../../lib/auth";
import { db } from "../../lib/db";
import { z } from "zod";

export async function createProject(
  values: z.infer<typeof createProjectSchema>
) {
  const user = await currentUser();

  if (!user || user.role !== UserRole.ADMIN) {
    return {
      message: "Unauthorized. Only admins can create projects.",
    };
  }

  const validatedFields = createProjectSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid field" };
  }
  const { name, detail, projectType, mainDeadline } = validatedFields.data;
  const formattedDeadline = new Date(mainDeadline).toISOString();
  try {
    const project = await db.project.create({
      data: {
        name: name,
        detail: detail,
        projectType: projectType,
        mainDeadline: formattedDeadline,
        mainStatus: MainStatus.ongoing,
      },
    });

    revalidatePath("/projects");

    return {
      success: "Project created successfully.",
      projectId: project.id,
    };
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      message: "Failed to create project. Please try again later.",
    };
  }
}
