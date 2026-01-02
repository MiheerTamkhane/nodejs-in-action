const { pgTable, serial, text, boolean, integer, index } = require("drizzle-orm/pg-core");
const { sql } = require("drizzle-orm");
const usersTable = require("./users.model");

const todosTable = pgTable("todos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  userId: integer("user_id")
    .references(() => usersTable.id)
    .notNull(),
}, (table) => ({
    titleSearchIndex: index('title_search_index').using('gin', sql`to_tsvector('english', ${table.title})`),
  }));

module.exports = todosTable;
