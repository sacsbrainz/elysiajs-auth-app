import { Elysia, t } from "elysia";
import { prisma } from "~/libs/prisma";

export const signIn = new Elysia().post(
  "/sign-in",
  async ({ body, set, jwt, setCookie }) => {
    const { email, password } = body;
    try {
      const checkUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!checkUser) {
        set.status = 400;
        return { message: "error", error: "Invalid email or password" };
      }

      const isMatch = await Bun.password.verify(password, checkUser.password);

      if (!isMatch) {
        set.status = 400;
        return { message: "error", error: "Invalid email or password" };
      }

      //  create token for 5 hours
      const token = await jwt.sign({
        id: checkUser.id,
        email: checkUser.email,
      });

      setCookie("access_token", token, {
        maxAge: 60 * 60 * 5, // 5 hours
        path: "/",
        domain: Bun.env.NODE_ENV === "production" ? "domain.com" : "",
        sameSite: "none",
        secure: Bun.env.NODE_ENV === "production",
        httpOnly: true,
      });

      set.status = 200;
      return {
        status: "success",
        message: " Signed in successfully",
        data: {
          token,
        },
      };
    } catch (error) {
      set.status = 500;
      return { message: "error", error: "Something went wrong" };
    }
  },
  {
    body: t.Object({
      email: t.String({
        format: "email",
        error: "Invalid email address",
      }),
      password: t.String({
        minLength: 8,
        error: "Password must be at least 8 characters long",
      }),
    }),
  }
);
