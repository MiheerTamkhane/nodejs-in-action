
const {pgTable, varchar, integer, serial} = require('drizzle-orm/pg-core');


const booksTable = pgTable('bookstore', {
    id: serial('id').primaryKey(),
    title: varchar({length: 255}).notNull(),
    author: varchar({length: 255}).notNull(),
    publishedYear: integer('published_year'),
});

module.exports = {
booksTable
};