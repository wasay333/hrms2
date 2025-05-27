"use server";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { RegisterSchema } from "../schema/index";
import { db } from "../lib/db";
import { GetUserByEmail } from "../data/user";
import { generateVerificationToken } from "../lib/token";
import { sendVerificationEmail } from "../lib/mail";
export const Register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid field" };
  }

  const { email, name, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await GetUserByEmail(email);
  if (existingUser) {
    return { error: "Email is already taken!" };
  }
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return { success: "Confirmation email sent!" };
};
