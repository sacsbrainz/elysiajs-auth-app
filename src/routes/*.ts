import Elysia from "elysia";
import { authRoutes } from "~/routes/auth";
import { homeRoutes } from "./home";

export const routes = new Elysia().use(authRoutes).use(homeRoutes);
