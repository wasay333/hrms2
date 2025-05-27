"use server";

import { UserRole } from "@prisma/client";
import { z } from "zod";
import { currentUser } from "../../lib/auth";
import { employeeSchema } from "../../schema";
import { db } from "../../lib/db";
import { sendInvitationEmail } from "../../lib/mail";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../../lib/token";

export async function inviteEmployee(values: z.infer<typeof employeeSchema>) {
  const user = await currentUser();
  if (!user || user.role !== UserRole.ADMIN) {
    return {
      success: false,
      error: { message: "Unauthorized: Admin access required" },
    };
  }

  const validated = employeeSchema.safeParse(values);
  if (!validated.success) {
    return { error: "Invalid field" };
  }

  const {
    email,
    role,
    name,
    password,
    dateOfJoining,
    phone,
    position,
    bio,
    jobtype,
  } = validated.data;

  const hashedPassword = await bcrypt.hash(password, 10);
  const formattedDateOfJoining = new Date(dateOfJoining).toISOString();

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Email is already taken!" };
  }

  const employee = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      position,
      bio,
      dateOfJoining: formattedDateOfJoining,
      jobtype,
    },
  });

  await db.leaveBalance.create({
    data: {
      userId: employee.id,
      total: 22,
      used: 0,
      remaining: 22,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendInvitationEmail(email, verificationToken.token);

  return { success: "Invitation sent successfully!" };
}
