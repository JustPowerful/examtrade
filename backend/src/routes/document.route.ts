import Elysia, { t } from "elysia";
import { authPlugin } from "../plugins/auth.plugin";
import path from "path";

const router = new Elysia({
  prefix: "/document",
});

// routes that do not require authentication

// routes that require authentication
router.use(authPlugin).post(
  "/upload",
  async ({ body, user, set }) => {
    try {
      const file = body.file;
      if (!file) {
        set.status = 400; // Bad Request
        return {
          message: "Please select a file before uploading",
        };
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
      }
      const baseDir = path.join(__dirname, "..", "public", "documents");
      const fileName = Date.now() + "-" + user?.id + file.name;
      await Bun.write(path.join(baseDir, fileName), file);

      // TODO: add file to database
      // TDOD: serve the public folder as static

      return {
        message: "File uploaded successfully",
      };
    } catch (error) {}
  },
  {
    body: t.Object({
      file: t.File({
        maxSize: 10 * 1024 * 1024, // 10MB
      }),
    }),
  }
);

export default router;
