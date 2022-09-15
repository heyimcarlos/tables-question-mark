import { createProtectedRouter, createRouter } from "./context";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";

const publicPatientRouter = createRouter()
  .mutation("update", {
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
  })
  .mutation("create-record", {
    input: z.object({
      name: z.string(),
      lastName: z.string(),
      address: z.string(),
      phone: z.string(),
      email: z.string(),
    }),
    async resolve({ input, ctx }) {
      const patientRecord = await ctx.prisma.patientRecord.create({
        data: {
          name: input.name,
          address: input.address,
          phone: input.phone,
          email: input.email,
          lastName: input.lastName,
        },
      });
      return patientRecord;
    },
  });

const loggedInPatientRouter = createProtectedRouter();

export const patientRouter = createRouter()
  .merge("public.", publicPatientRouter)
  .merge(loggedInPatientRouter);
