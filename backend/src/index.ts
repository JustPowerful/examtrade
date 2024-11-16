import { Elysia } from "elysia";

const app = new Elysia();

// routes
import authRoute from "./routes/auth.route";

app.group("/api", (api) => api.use(authRoute));

app.listen(3000);
console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
