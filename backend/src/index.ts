import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";

const app = new Elysia();

// routes
import authRoute from "./routes/auth.route";
import instituteRoute from "./routes/institute.route";
import documentRoute from "./routes/document.route";

// used for serving uploaded files
app.use(
  staticPlugin({
    prefix: "/uploads",
    assets: "./uploads",
  })
);

// used for serving static files
app.use(
  staticPlugin({
    prefix: "/public",
    assets: "./public",
  })
);

app.get("/health", () => {
  return {
    healthy: true,
    version: "1.0.0",
    message: "Backend service is healthy",
  };
});

app.group("/api", (app) => {
  return app.use(authRoute).use(instituteRoute).use(documentRoute);
});

app.listen(3000);
console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
