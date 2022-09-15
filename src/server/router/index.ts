// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { userRouter } from "./user";
import { patientRouter } from "./patient";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("patient.", patientRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
