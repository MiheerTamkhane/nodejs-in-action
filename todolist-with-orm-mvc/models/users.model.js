const { pgTable, serial, text, varchar } = require("drizzle-orm/pg-core");

const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar({ length: 55 }).notNull(),
  lastName: varchar({ length: 55 }),
  email: varchar({ length: 255 }).notNull(),
  password: text("password").notNull(),
});

module.exports = usersTable;
