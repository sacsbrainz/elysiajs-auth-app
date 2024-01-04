import Elysia from "elysia";
import { signIn } from "~/controllers/auth/signIn";
import { signUp } from "~/controllers/auth/signUp";

export const authRoutes = new Elysia({
  prefix: "/auth",
})
  .use(signIn)
  .use(signUp);
