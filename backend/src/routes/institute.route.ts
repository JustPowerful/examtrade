import { Elysia } from "elysia";
import { instituteInsertSchema, institutesTable } from "../db/schema";
import { authPlugin } from "../plugins/auth.plugin";
import { db } from "../db";
import { eq } from "drizzle-orm";

const instituteRoute = new Elysia({
  prefix: "/institute",
}).use(authPlugin);

instituteRoute.post(
  "/create",
  async ({ body, user, set }) => {
    const { name, city } = body;
    if (user?.role !== "admin") {
      set.status = 401; // Unauthorized
      return {
        message: "Unauthorized",
      };
    }

    await db.insert(institutesTable).values({
      name,
      city,
    });

    const institute = (
      await db
        .select()
        .from(institutesTable)
        .where(eq(institutesTable.name, name))
    )[0];

    if (!institute) {
      return {
        message: "Institute not found",
      };
    }

    return {
      message: "Institute created",
      institute,
    };
  },
  {
    body: instituteInsertSchema,
  }
);

export default instituteRoute;
