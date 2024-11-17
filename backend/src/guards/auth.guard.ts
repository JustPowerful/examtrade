// authGuard.ts
import { Context } from "elysia";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { JWTPayloadSpec } from "@elysiajs/jwt";

interface AuthContext extends Context {
  jwt: {
    sign: (
      morePayload: Record<string, string | number> & JWTPayloadSpec
    ) => Promise<string>;
    verify: (
      jwt?: string
    ) => Promise<(Record<string, string | number> & JWTPayloadSpec) | false>;
  };
}

interface ValidJWTPayload extends Record<string, string | number> {
  id: string; // Ensuring id is always a string for UUID
}

export const authGuard = {
  beforeHandle: async ({ jwt, set, cookie: { auth } }: AuthContext) => {
    if (!auth) {
      set.status = 401;
      return {
        message: "Unauthorized",
      };
    }
    const token = auth.value?.split(" ")[1];
    const valid = await jwt.verify(token);

    if (!valid) {
      set.status = 401;
      return {
        message: "Unauthorized",
      };
    }

    const payload = valid as ValidJWTPayload;

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, payload.id)); // Now payload.id is guaranteed to be a string
  },
};
