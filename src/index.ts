import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { routes } from "./routes/*";
import cookie from "@elysiajs/cookie";
import { logger } from "@bogeychan/elysia-logger";

const app = new Elysia()

  .use(
    jwt({
      name: "jwt",
      secret: "secret",
      exp: "5h",
    })
  )
  .use(cookie())
  .use(
    logger({
      level: Bun.env.NODE_ENV === "development" ? "debug" : "info",
    })
  )
  .use(routes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
