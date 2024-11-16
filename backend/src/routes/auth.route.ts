import { Elysia, t } from "elysia";

import { userInsertSchema } from "../db/schema";

const authRoute = new Elysia({
  prefix: "/auth",
});

authRoute.post(
  "/register",
  async ({ body }) => {
    const { firstname, lastname, email, password } = body;
    const hashedPassword = await Bun.password.hash(password);
  },
  {
    body: userInsertSchema,
  }
);

export default authRoute;
