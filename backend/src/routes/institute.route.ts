import { Elysia, t } from "elysia";
import { instituteInsertSchema, institutesTable } from "../db/schema";
import { authPlugin } from "../plugins/auth.plugin";
import { db } from "../db";
import { eq, ilike } from "drizzle-orm";

const router = new Elysia({
  prefix: "/institute",
});

// routes that do not require authentication
router.get(
  "/paginate",
  async ({ query, set }) => {
    try {
      const { page, limit, search } = query;

      const institutes = await db
        .select()
        .from(institutesTable)
        .where(ilike(institutesTable.name, `%${search}%`))
        .limit(limit)
        .offset((page - 1) * limit);

      return {
        message: "Successfully fetched institutes",
        institutes: institutes,
      };
    } catch (error) {
      set.status = 500;
      return {
        message: "Internal server error",
      };
    }
  },
  {
    query: t.Object({
      page: t.Number({ default: 1 }),
      limit: t.Number({ default: 10 }),
      search: t.String({ default: "" }),
    }),
  }
);

// routes that require authentication
router
  .use(authPlugin)
  .post(
    "/create",
    async ({ body, user, set }) => {
      try {
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
      } catch (error) {
        set.status = 500;
        return {
          message: "Internal server error",
        };
      }
    },
    {
      body: instituteInsertSchema,
    }
  )
  .post(
    "/create",
    async ({ body, user, set }) => {
      try {
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
      } catch (error) {
        set.status = 500;
        return {
          message: "Internal server error",
        };
      }
    },
    {
      body: instituteInsertSchema,
    }
  )
  .delete(
    "/delete",
    async ({ body, set, user }) => {
      try {
        const { id } = body;
        if (user?.role !== "admin") {
          return {
            message: "Unauthorized",
          };
        }

        await db.delete(institutesTable).where(eq(institutesTable.id, id));
        return {
          message: "Institute deleted",
        };
      } catch (error) {
        set.status = 500;
        return {
          messsage: "Internal server error",
        };
      }
    },
    {
      body: t.Object({
        id: t.String(),
      }),
    }
  )
  .patch(
    "/update/:id",
    async ({ body, user, set, params: { id } }) => {
      try {
        const { name, city } = body;
        if (user?.role !== "admin") {
          return {
            message: "Unauthorized",
          };
        }
        const institute = await db
          .update(institutesTable)
          .set({
            name,
            city,
          })
          .returning();

        return {
          message: "Successfully updated institute",
          institute: institute[0],
        };
      } catch (error) {
        set.status = 500;
        return {
          message: "Internal server error",
        };
      }
    },
    { body: instituteInsertSchema, params: t.Object({ id: t.String() }) }
  );

export default router;
