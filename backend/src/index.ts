import { Elysia } from "elysia";

const app = new Elysia();

// routes
import authRoute from "./routes/auth.route";
import { authGuard } from "./guards/auth.guard";

app.group("/api", (app) => {
  return app
    .use(authRoute)
    .guard(authGuard)
    .get("/health", () => "OK")
    .get("/services", () => "OK");
});

app.listen(3000);
console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
