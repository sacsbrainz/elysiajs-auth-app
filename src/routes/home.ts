import Elysia from "elysia";
import { home } from "~/controllers/home";

export const homeRoutes = new Elysia({
  prefix: "/dashboard",
}).use(home);
