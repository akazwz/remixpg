import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: varchar("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  done: boolean("done"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
