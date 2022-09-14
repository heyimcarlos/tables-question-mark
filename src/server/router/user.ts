import { createRouter } from "./context";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";

export const userRouter = createRouter().mutation("update", {
  input: z.object({
    username: z.string(),
  }),
  async resolve({ input, ctx }) {
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
