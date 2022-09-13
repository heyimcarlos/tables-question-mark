import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { comparePassword, ErrorCode } from "../../../lib/auth";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "John Doe" },
        password: { label: "Password", type: "password", placeholder: "********" },
      },
      async authorize(credentials, _req) {
        if (!credentials) {
          console.log("credentials are missing");
          throw new Error(ErrorCode.InternalServerError);
        }
        const user = await prisma.user.findUnique({
          where: { username: credentials.username.toLowerCase() },
        });
        if (!user) {
          throw new Error(ErrorCode.UserNotFound);
        }
        if (!user.password) {
          throw new Error(ErrorCode.UserMissingPassword);
        }
        const isCorrectPassword = await comparePassword(credentials.password, user.password);
        if (!isCorrectPassword) {
          throw new Error(ErrorCode.IncorrectPassword);
        }
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          name: user.name,
        };
      },
    }),
    // ...add more providers here
  ],
  debug: env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
