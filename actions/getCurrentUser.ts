"use server";

import { GetUserById } from "../data/user";
import { currentUser } from "../lib/auth";

export async function getCurrentUser() {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const dbUser = await GetUserById(user.id);
  if (!dbUser) throw new Error("User not found");

  const { name, email, role, position, image, phone } = dbUser;

  return { name, email, role, position, image, phone };
}
