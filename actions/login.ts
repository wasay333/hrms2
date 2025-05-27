"use server";

import * as z from "zod";
import { LoginSchema } from "../schema/index";
import { signIn } from "../auth";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "../lib/token";
import { GetUserByEmail } from "../data/user";
import { sendVerificationEmail } from "../lib/mail";
import { db } from "../lib/db";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid form inputs" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await GetUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Confirmation email sent!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    const nowUtc = new Date();

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        lastLoginAt: nowUtc,
      },
    });
    const lastAttendance = await db.attendance.findFirst({
      where: { userId: existingUser.id },
      orderBy: { date: "desc" },
      select: { date: true },
    });

    return {
      success: "Successfully logged in.",
      lastLoginAt: nowUtc,
      lastAttendanceDate: lastAttendance?.date ?? null,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials!" };
    }
    return { error: "Something went wrong!" };
  }
};
