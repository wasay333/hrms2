import { Resend } from "resend";
import { appUrl } from "./url";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${appUrl}/auth/new-verification?token=${token}`;
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${appUrl}/auth/new-password?token=${token}`;
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};

export const sendInvitationEmail = async (email: string, token: string) => {
  const confirmLink = `${appUrl}/auth/onboarding?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "You're Invited to Join",
    html: `<p>Click <a href="${confirmLink}">here</a> to onboard on our team.</p>`,
  });
};
