import Elysia, { t } from "elysia";
import { authPlugin } from "../plugins/auth.plugin";
import path from "path";
import { db } from "../db";
import { documentsTable } from "../db/schema";
import { DatabaseError } from "pg";
import { eq, ilike, or } from "drizzle-orm";
import { unlink } from "node:fs/promises";

const router = new Elysia({
  prefix: "/document",
});

// routes that do not require authentication
router
  .get(
    "/paginate",
    ({ query, set }) => {
      try {
        const { page, limit, search } = query;
        const documents = db
          .select()
          .from(documentsTable)
          .where(
            or(
              ilike(documentsTable.title, `%${search}%`),
              ilike(documentsTable.description, `%${search}%`)
            )
          )
          .limit(limit)
          .offset((page - 1) * limit);

        return {
          message: "Successfully fetched documents",
          documents,
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
        page: t.Number({
          default: 1,
        }),
        limit: t.Number({
          default: 10,
        }),
        search: t.String({
          default: "",
        }),
      }),
    }
  )
  .get(
    "/:id",
    async ({ set, params: { id } }) => {
      try {
        const document = await db
          .select()
          .from(documentsTable)
          .where(eq(documentsTable.id, id));

        if (document.length === 0) {
          set.status = 404; // not found
          return {
            message: "Document not found",
          };
        }

        return {
          message: "Successfully fetched document",
          document: document[0],
        };
      } catch (error) {
        set.status = 500;
        return {
          message: "Internal server error",
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
// routes that require authentication
router
  .use(authPlugin)
  .post(
    "/upload",
    async ({ body, user, set }) => {
      try {
        const { title, description, instituteId, file, parentId } = body;
        if (!file) {
          set.status = 400; // Bad Request
          return {
            message: "Please select a file before uploading",
          };
        }

        if (
          ![
            "application/pdf",
            "application/doc",
            "application/docx",
            "application/ppt",
            "application/pptx",
          ].includes(file.type)
        ) {
          set.status = 400; // Bad Request
          return {
            message:
              "Invalid file type, please upload a PDF, DOC, DOCX, PPT or PPTX file",
          };
        }
        const baseDir = path.join(__dirname, "..", "..", "public", "documents");
        const fileName = Date.now() + "-" + user?.id + file.name;
        await Bun.write(path.join(baseDir, fileName), file);

        await db.insert(documentsTable).values({
          title,
          description,
          src: `/public/documents/${fileName}`,
          instituteId,
          userId: user?.id!,
          parentId: parentId,
        });

        return {
          message: "File uploaded successfully",
          src: `/public/documents/${fileName}`,
        };
      } catch (error) {
        if (error instanceof DatabaseError) {
          if (error.code === "22P02") {
            set.status = 400; // Bad Request
            return {
              message: "Couldn't find the institute with the given id",
            };
          }
        }
      }
    },
    {
      body: t.Object({
        file: t.File({
          maxSize: 10 * 1024 * 1024, // 10MB
        }),
        title: t.String({
          maxLength: 100,
        }),
        description: t.String({
          maxLength: 600,
        }),
        instituteId: t.String(),
        parentId: t.Optional(t.String()),
      }),
    }
  )
  .delete(
    "/remove/:id",
    async ({ set, user, params: { id } }) => {
      console.log("Request sent to /remove");
      const document = await db
        .select({
          id: documentsTable.id,
          userId: documentsTable.userId,
          src: documentsTable.src,
        })
        .from(documentsTable)
        .where(eq(documentsTable.id, id));

      if (!document) {
        set.status = 404;
        return {
          message: "Document doesn't exist",
        };
      }

      if (document[0].userId !== user.id) {
        set.status = 401;
        return {
          message: "Unauthorized to remove a document that is not yours",
        };
      }

      const baseDir = path.join(__dirname, "..", "..", document[0].src);
      await unlink(baseDir);
      await db
        .delete(documentsTable)
        .where(eq(documentsTable.id, document[0].id));
      return {
        message: "Successfully removed document",
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .patch(
    "/update/:id",
    async ({ params: { id }, user, set, body }) => {
      try {
        const { title, description } = body;
        const document = await db
          .select()
          .from(documentsTable)
          .where(eq(documentsTable.id, id));
        if (document.length === 0) {
          set.status = 404;
          return { message: "Couldn't find the document." };
        }

        if (document[0].userId !== user.id) {
          set.status = 401; // Unauthorized
          return { message: "Unauthorized to edit this document." };
        }

        const newDocument = await db
          .update(documentsTable)
          .set({
            title,
            description,
          })
          .where(eq(documentsTable.id, id))
          .returning();

        return {
          message: "Successfully updated document",
          document: newDocument[0],
        };
      } catch (error) {
        console.log(error);
        set.status = 500;
        return { message: "Internal server error" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        title: t.String(),
        description: t.String(),
      }),
    }
  );

export default router;
