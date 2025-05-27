import { db } from "../lib/db";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationtoken = await db.verificationToken.findUnique({
      where: { token },
    });
    return verificationtoken;
  } catch (error) {
    console.error("Error fetching verification token by token:", error);
    return null;
  }
};
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationtoken = await db.verificationToken.findFirst({
      where: { email },
    });
    return verificationtoken;
  } catch (error) {
    console.error("Error fetching verification token by email:", error);
    return null;
  }
};
