
const db = require('./db');
const {booksTable} = require('./drizzle/schema');

async function getAllBooks() { 
    const books = await db.select().from(booksTable);
    console.log("books from getAllBooks:", books);
    return books;
 }

 async function createBook(title, author, publishedYear) {
     const [newBook] = await db.insert(booksTable).values({
        title,
        author,
        published_year: publishedYear,
    }).returning();
    console.log("Created book:", newBook);
    return newBook;
 }

 // Main async function to run everything in order
 async function main() {
    console.log("Starting...\n");
    
    // Check initial state
    await getAllBooks();
    
    console.log("\nCreating books...");
    // Create books
    await createBook('New Book', 'New Author', 2024);
    await createBook('New Book 2', 'New Author 2', 2025);
    
    console.log("\nFinal state:");
    // Check final state
    await getAllBooks();
    
    process.exit(0);
 }

 main().catch(console.error);
