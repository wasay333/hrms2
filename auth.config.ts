export const runtime = "nodejs";

import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginSchema } from "./schema/index";
import { GetUserByEmail } from "./data/user";
import { NextAuthConfig } from "next-auth";

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;
        const user = await GetUserByEmail(email);
        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        return passwordsMatch ? user : null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default authConfig;
