import { Elysia, t } from "elysia";

export const home = (app: Elysia) =>
  app
    .get("/", () => "Hello World")
    
