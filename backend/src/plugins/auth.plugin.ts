import cookie from "@elysiajs/cookie";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const authPlugin = (app: Elysia) =>
  app
    .use(
      jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET!,
      })
    )
    .use(cookie())
    .derive(async ({ jwt, cookie: { auth }, set }) => {
      if (!auth.value) {
        set.status = 401; // Unauthorized
        throw new Error("Unauthorized");
      }

      const token = auth.value.split(" ")[1];
      const valid = await jwt.verify(token);

      if (!valid) {
        set.status = 401; // Unauthorized
        throw new Error("Unauthorized");
      }
      const user = (
        await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, valid.id.toString()))
      )[0];

      if (!user) {
        set.status = 401; // Unauthorized
        throw new Error("Unauthorized");
      }

      return {
        user,
      };
    });
