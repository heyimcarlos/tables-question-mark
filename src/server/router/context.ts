// src/server/router/context.ts
import * as trpc from "@trpc/server";
import { Maybe } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { prisma } from "../db/client";

type CreateContextOptions = trpcNext.CreateNextContextOptions | GetServerSidePropsContext;

async function getUserFromSession({
  session,
}: {
  session: Maybe<Session>;
  req: CreateContextOptions["req"];
}) {
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
    },
  });

  // some hacks to make sure `username` and `email` are never inferred as `null`
  if (!user) {
    return null;
  }

  const { email, username } = user;
  if (!email) {
    return null;
  }
  // const avatar = user.avatar || defaultAvatarSrc({ email });

  return {
    ...user,
    email,
    username,
  };
}

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async ({ req, res }: CreateContextOptions) => {
  // for API-response caching see https://trpc.io/docs/caching
  const session = await getServerAuthSession({ req, res });

  const user = await getUserFromSession({ session, req });

  return {
    session,
    user,
    prisma,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();

/**
 * Creates a tRPC router that asserts all queries and mutations are from an authorized user. Will throw an unauthorized error if a user is not signed in.
 **/
export function createProtectedRouter() {
  return createRouter().middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        ...ctx,
        // infers that `session` is non-nullable to downstream resolvers
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
}
