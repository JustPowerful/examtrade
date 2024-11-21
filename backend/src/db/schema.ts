import { relations } from "drizzle-orm";
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

export const documentsTable = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  userId: uuid("userId").notNull(),
  instituteId: uuid("instituteId").notNull(),
  description: varchar("description"),
  src: varchar("src").notNull(),
  parentId: uuid("parentId"), // parent document id
});

export const documentsRelations = relations(documentsTable, ({ one }) => ({
  usersTable: one(usersTable, {
    fields: [documentsTable.userId],
    references: [usersTable.id],
  }),
  documentsTable: one(documentsTable, {
    fields: [documentsTable.parentId],
    references: [documentsTable.id],
  }),
  institutesTable: one(institutesTable, {
    fields: [documentsTable.instituteId],
    references: [institutesTable.id],
  }),
}));

export const userInsertSchema = createInsertSchema(usersTable);
export const instituteInsertSchema = createInsertSchema(institutesTable);
export const documentInsertSchema = createInsertSchema(documentsTable);
