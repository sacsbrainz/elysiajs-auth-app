import { Elysia, t } from "elysia";
import { prisma } from "~/libs/prisma";

export const signUp = new Elysia().post(
  "/sign-up",
  async ({ body, set, jwt, setCookie }) => {
    const { email, password } = body;
    try {
      //    check if user exists
      const checkUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (checkUser) {
        set.status = 409;
        return { message: "error", error: "You have an account already" };
      }

      const hash = await Bun.password.hash(password);

      // create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hash,
        },
      });

      if (!user) {
        set.status = 500;
        return { message: "error", error: "Something went wrong" };
      }

      //  create token for 5 hours
      const token = await jwt.sign({
        id: user.id,
        email: user.email,
      });

      setCookie("access_token", token, {
        maxAge: 60 * 60 * 5, // 5 hours
        path: "/",
        domain: Bun.env.NODE_ENV === "production" ? "domain.com" : "",
        sameSite: "none",
        secure: Bun.env.NODE_ENV === "production",
        httpOnly: true,
      });

      set.status = 201;
      return {
        status: "success",
        message: "Account created successfully",
        data: {
          token,
        },
      };
    } catch (error) {
      console.log(error);
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
