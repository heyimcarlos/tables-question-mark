import NextAuth, { Session, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { comparePassword, ErrorCode } from "../../../lib/auth";
import { env } from "../../../env/server.mjs";
import { UserPermissionRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      if (!user) {
        return token;
      }

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        name: user.name,
      };
    },
    async session({ session, token }) {
      const sesh: Session = {
        ...session,
        user: {
          ...session.user,
          id: token.id as number,
          email: token.email,
          username: token.username as string,
          role: token.role as UserPermissionRole,
          name: token.name,
        },
      };
      return sesh;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  session: {
    strategy: "jwt",
  },
  debug: env.NODE_ENV === "development",
  secret: env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
