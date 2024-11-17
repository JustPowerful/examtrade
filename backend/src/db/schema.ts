import { pgTable, varchar, pgEnum, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";

export const userRoleEnum = pgEnum("user_role", [
  "student",
  "professor",
  "admin",
]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstname: varchar("firstname").notNull(),
  lastname: varchar("lastname").notNull(),
  email: varchar("email").notNull(),
  password: varchar("password").notNull(),
  role: userRoleEnum("role").notNull().default("student"),
});

export const institutesTable = pgTable("institutes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  city: varchar("city").notNull(),
});

export const userInsertSchema = createInsertSchema(usersTable);
export const instituteInsertSchema = createInsertSchema(institutesTable);
