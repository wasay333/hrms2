// actions/setting.ts
"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";
import { SettingSchema } from "../schema";
import { db } from "../lib/db";
import { currentUser } from "../lib/auth";
import { GetUserById } from "../data/user";

export const setting = async (values: z.infer<typeof SettingSchema>) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const dbUser = await GetUserById(user.id as string);
  if (!dbUser || !dbUser.password) return { error: "Unauthorized" };

  // Ensure both passwords are present
  const { password, newPassword } = values;
  if (!password || !newPassword) return { error: "Missing password fields." };

  const isMatch = await bcrypt.compare(password, dbUser.password);
  if (!isMatch) return { error: "Current password is incorrect." };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      password: hashedPassword,
    },
  });

  return { success: "Password updated successfully." };
};
