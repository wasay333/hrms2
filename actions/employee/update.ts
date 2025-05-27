"use server";

import { employeeUpdateSchema } from "../../schema";
import { currentUser } from "../../lib/auth";
import { db } from "../../lib/db";
import { z } from "zod";
import { GetUserById } from "../../data/user";

export async function updateEmployee(
  id: string,
  values: z.infer<typeof employeeUpdateSchema>
) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };
  const dbUser = await GetUserById(user.id as string);
  if (!dbUser || !dbUser.password) return { error: "Unauthorized" };
  const { name, email, phone, position, bio } = values;
  const updated = await db.user.update({
    where: { id },
    data: {
      name: name,
      email: email,
      phone: phone,
      position: position,
      bio: bio,
    },
  });

  return updated;
}
