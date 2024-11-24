import { Elysia, t } from "elysia";

import { userInsertSchema, usersTable } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import jwt from "@elysiajs/jwt";

const authRoute = new Elysia({
  prefix: "/auth",
}).use(
  jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET!,
  })
);

authRoute.post(
  "/register",
  async ({ body, set }) => {
    let { firstname, lastname, email, password, role } = body;

    if (role !== "student" && role !== "professor") {
      role = "student";
    }

    const exists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (exists.length > 0) {
      set.status = 409; // Conflict
      return {
        message: "User already exists",
      };
    }

    try {
      const hashedPassword = await Bun.password.hash(password);
      await db.insert(usersTable).values({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });
      return {
        message: "User registered successfully",
      };
    } catch (error) {
      set.status = 500;
      return {
        message: "Error registering user",
      };
    }
  },
  {
    body: userInsertSchema,
  }
);

authRoute.post(
  "/login",
  async ({ body, set, jwt, cookie: { auth } }) => {
    const { email, password } = body;

    const user = (
      await db.select().from(usersTable).where(eq(usersTable.email, email))
    )[0];
    if (!user) {
      set.status = 401; // Unauthorized
      return {
        message: "Invalid credentials",
      };
    }

    const valid = await Bun.password.verify(password, user.password);
    if (!valid) {
      set.status = 401; // Unauthorized
      return {
        message: "Invalid credentials",
      };
    }

    const token = await jwt.sign({
      id: user.id,
      email: user.email,
      exp: Date.now() + 7 * 60 * 60 * 1000,
    }); // expires in 7 hours

    auth.set({
      value: "Bearer " + token,
      httpOnly: true,
    });

    return {
      message: "Login successful",
    };
  },
  {
    body: t.Object({
      email: t.String({
        format: "email",
        maxLength: 255,
      }),
      password: t.String(),
    }),
  }
);

authRoute.post("/logout", async ({ cookie: { auth } }) => {
  auth.remove();
});

export default authRoute;
