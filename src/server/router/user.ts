import { createProtectedRouter, createRouter } from "./context";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";

const publicUserRouter = createRouter().mutation("update", {
  input: z.object({
    username: z.string(),
  }),
  async resolve({ input, ctx }) {
    // const a = await ctx.prisma.user.findFirst({
    //   where: {
    //     id: 1,
    //   },
    // });
    // return a;
    await ctx.prisma.user.update({
      where: {
        username: input.username,
      },
      data: {
        password: await hashPassword("123456"),
      },
    });
  },
});

const loggedInUserRouter = createProtectedRouter().query("records", {
  async resolve({ ctx }) {
    const records = await ctx.prisma.patientRecord.findMany();
    return records;
  },
});

export const userRouter = createRouter()
  .merge("public.", publicUserRouter)
  .merge(loggedInUserRouter);
