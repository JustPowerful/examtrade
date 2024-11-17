import { Elysia, Context } from "elysia";

const app = new Elysia();

// routes
import authRoute from "./routes/auth.route";
import instituteRoute from "./routes/institute.route";

app.group("/api", (app) => {
  return app.use(authRoute).use(instituteRoute);
});

app.listen(3000);
console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
