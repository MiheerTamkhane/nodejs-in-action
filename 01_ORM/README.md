# Drizzle ORM with PostgreSQL - Complete Tutorial 🗄️

A comprehensive step-by-step guide to building a database-driven Node.js application using Drizzle ORM and PostgreSQL.

---

## 📚 Table of Contents

1. [What is Drizzle ORM?](#what-is-drizzle-orm)
2. [Technologies & Packages](#technologies--packages)
3. [Project Setup](#project-setup)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Running the Application](#running-the-application)
6. [Understanding the Code](#understanding-the-code)

---

## 🤔 What is Drizzle ORM?

**Drizzle ORM** is a modern, lightweight, and TypeScript-first ORM (Object-Relational Mapping) for Node.js. It bridges the gap between your JavaScript/TypeScript code and SQL databases.

### Why Drizzle ORM?

**Traditional Problem:**
```javascript
// Raw SQL - Error-prone, no type safety, string concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`;
```

**Drizzle Solution:**
```javascript
// Type-safe, autocomplete, and SQL-like syntax
const user = await db.select().from(users).where(eq(users.id, userId));
```

### Key Benefits:
- **TypeScript-First**: Full type safety and autocomplete
- **Lightweight**: Minimal overhead, close to raw SQL performance
- **SQL-Like Syntax**: Easy to learn if you know SQL
- **Zero Dependencies**: No bloated library dependencies
- **Automatic Migrations**: Schema changes are managed automatically
- **Multiple Databases**: Supports PostgreSQL, MySQL, SQLite

### When to Use Drizzle ORM?

✅ **Use Drizzle When:**
- You want type safety with databases
- You need SQL-like control without writing raw SQL
- Performance is critical (minimal overhead)
- You want automatic migrations

❌ **Consider Alternatives When:**
- You need complex relationships (try Prisma)
- You prefer active record pattern (try Sequelize)
- Your team is unfamiliar with SQL concepts

---

## 🛠️ Technologies & Packages

### Core Dependencies

#### 1. **drizzle-orm** (v0.45.1)
```bash
npm install drizzle-orm
```

**What it does:**
- Core ORM library for database operations
- Provides type-safe query builders
- Handles database connections and queries
- Supports multiple database dialects

**Why it exists:**
Traditional ORMs like Sequelize or TypeORM are heavy and abstract too much SQL. Drizzle gives you SQL-like control with TypeScript safety, offering the best of both worlds.

**Key Features:**
- Query builder: `select()`, `insert()`, `update()`, `delete()`
- Relational queries with joins
- Transaction support
- Migration management

---

#### 2. **drizzle-kit** (v0.31.8)
```bash
npm install drizzle-kit
```

**What it does:**
- CLI tool for Drizzle ORM
- Generates SQL migrations from schema changes
- Manages database migrations (push, pull, generate)
- Provides introspection tools

**Why it exists:**
Managing database schema changes manually is error-prone. Drizzle Kit automates migration generation, ensuring your database stays in sync with your code.

**Common Commands:**
```bash
npx drizzle-kit generate  # Generate migrations
npx drizzle-kit migrate   # Run migrations
npx drizzle-kit push      # Push schema to database
npx drizzle-kit studio    # Open Drizzle Studio (GUI)
```

---

#### 3. **pg** (v8.16.3)
```bash
npm install pg
```

**What it does:**
- Official PostgreSQL client for Node.js
- Handles low-level database connections
- Manages connection pooling
- Executes SQL queries

**Why it exists:**
Node.js doesn't have built-in PostgreSQL support. The `pg` package provides the native driver to communicate with PostgreSQL databases.

**What Drizzle uses it for:**
Drizzle ORM uses `pg` under the hood to actually connect to and query PostgreSQL databases.

---

#### 4. **dotenv** (v17.2.3)
```bash
npm install dotenv
```

**What it does:**
- Loads environment variables from `.env` file
- Keeps sensitive data (passwords, API keys) out of code
- Manages different configs for dev/staging/production

**Why it exists:**
Hardcoding database credentials or API keys in code is a security risk. Dotenv allows you to store these in a separate file that's not committed to version control.

**Usage:**
```javascript
require('dotenv/config');
const dbUrl = process.env.DATABASE_URL;
```

---

### Supporting Technologies

#### **PostgreSQL**
- **What**: Open-source relational database
- **Why**: Robust, ACID-compliant, supports JSON, full-text search
- **Alternatives**: MySQL, SQLite, MongoDB

#### **Docker**
- **What**: Containerization platform
- **Why**: Easy to run PostgreSQL without local installation
- **Benefit**: Consistent environment across machines

---

## 📦 Project Setup

### Prerequisites
- Node.js (v14+)
- Docker Desktop (for PostgreSQL)
- Basic SQL knowledge

---

## 🚀 Step-by-Step Implementation

Follow these steps **in exact order** to build the application:

---

### **STEP 1: Initialize the Project**

Create project directory and initialize npm:

```bash
mkdir 01_ORM
cd 01_ORM
npm init -y
```

**What happens:**
- Creates `package.json` with default configuration
- Sets up npm package management

---

### **STEP 2: Install Dependencies**

Install all required packages:

```bash
npm install drizzle-orm drizzle-kit pg dotenv
```

**What happens:**
- Downloads and installs all packages
- Creates `node_modules/` folder
- Updates `package.json` with dependencies

**Verify installation:**
Check your `package.json`:
```json
{
  "dependencies": {
    "dotenv": "^17.2.3",
    "drizzle-kit": "^0.31.8",
    "drizzle-orm": "^0.45.1",
    "pg": "^8.16.3"
  }
}
```

---

### **STEP 3: Create Docker Compose File**

**File:** `docker-compose.yml`

Create this file to define your PostgreSQL container:

```yaml
services: 
  postgres:
    image: postgres:17.4
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: miheer
      POSTGRES_DB: bookstore
    ports:
      - "5432:5432"
```

**Explanation:**

| Configuration | Description |
|--------------|-------------|
| `image: postgres:17.4` | PostgreSQL version 17.4 Docker image |
| `POSTGRES_USER` | Database superuser name |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Default database name to create |
| `ports: "5432:5432"` | Map container port 5432 to localhost 5432 |

**Why this step?**
Docker provides an isolated PostgreSQL instance without modifying your system. You can easily delete it when done.

**Start the database:**
```bash
docker-compose up -d
```

**Verify it's running:**
```bash
docker ps
```

---

### **STEP 4: Create Environment Variables File**

**File:** `.env`

Create this file to store sensitive configuration:

```env
DATABASE_URL=postgres://postgres:miheer@localhost:5432/bookstore
```

**URL Format Breakdown:**
```
postgres://[username]:[password]@[host]:[port]/[database]
         ↓          ↓           ↓      ↓        ↓
       postgres   miheer   localhost  5432  bookstore
```

**Security Note:**
Add `.env` to your `.gitignore` to prevent committing credentials:
```bash
echo ".env" >> .gitignore
```

**Why this step?**
Environment variables keep credentials secure and allow different configs for development, staging, and production.

---

### **STEP 5: Create Drizzle Configuration**

**File:** `drizzle.config.js`

This configures how Drizzle Kit operates:

```javascript
const { defineConfig } = require("drizzle-kit");

const config = defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

module.exports = config;
```

**Configuration Breakdown:**

| Option | Value | Description |
|--------|-------|-------------|
| `dialect` | `"postgresql"` | Database type (postgresql, mysql, sqlite) |
| `schema` | `"./drizzle/schema.js"` | Path to schema definition file |
| `out` | `"./drizzle"` | Output directory for migrations |
| `dbCredentials.url` | Connection string | Database connection URL from .env |

**Why this step?**
Drizzle Kit needs to know:
- Where your schema is defined
- Which database to connect to
- Where to store generated migrations

---

### **STEP 6: Create Schema Definition**

**File:** `drizzle/schema.js`

Define your database tables using Drizzle's schema builder:

```javascript
const {pgTable, varchar, integer} = require('drizzle-orm/pg-core');

const booksTable = pgTable('bookstore', {
    id: integer().primaryKey(),
    title: varchar({length: 255}).notNull(),
    author: varchar({length: 255}).notNull(),
    publishedYear: integer(),
});

module.exports = {
    booksTable
};
```

**Code Breakdown:**

**1. Import Schema Builders:**
```javascript
const {pgTable, varchar, integer} = require('drizzle-orm/pg-core');
```
- `pgTable`: Function to define PostgreSQL tables
- `varchar`: String column type
- `integer`: Number column type

**2. Define Table:**
```javascript
const booksTable = pgTable('bookstore', { ... });
```
- First argument: `'bookstore'` - actual table name in database
- Second argument: Column definitions object

**3. Define Columns:**

| Column | Type | Constraints | SQL Equivalent |
|--------|------|------------|----------------|
| `id` | `integer()` | `.primaryKey()` | `id INTEGER PRIMARY KEY` |
| `title` | `varchar({length: 255})` | `.notNull()` | `title VARCHAR(255) NOT NULL` |
| `author` | `varchar({length: 255})` | `.notNull()` | `author VARCHAR(255) NOT NULL` |
| `publishedYear` | `integer()` | None | `publishedYear INTEGER` |

**Available Column Types:**
- `integer()` - Whole numbers
- `varchar()` - Variable-length strings
- `text()` - Unlimited length text
- `boolean()` - True/false
- `timestamp()` - Date and time
- `json()` - JSON data

**Available Constraints:**
- `.primaryKey()` - Unique identifier
- `.notNull()` - Cannot be null
- `.unique()` - Must be unique
- `.default(value)` - Default value

**Why this step?**
The schema is the single source of truth for your database structure. Drizzle uses it to:
- Generate TypeScript types
- Create SQL migrations
- Validate queries

---

### **STEP 7: Create Database Connection**

**File:** `db/index.js`

Create the database connection instance:

```javascript
require("dotenv/config")
const {drizzle} = require('drizzle-orm/node-postgres');

// postgres connection url
// postgres://<username>:<password>@<host>:<port>/<database>
const db = drizzle(process.env.DATABASE_URL);

module.exports = db;
```

**Code Breakdown:**

**1. Load Environment Variables:**
```javascript
require("dotenv/config")
```
- Loads variables from `.env` file
- Makes `process.env.DATABASE_URL` available

**2. Import Drizzle:**
```javascript
const {drizzle} = require('drizzle-orm/node-postgres');
```
- `node-postgres`: Adapter for PostgreSQL using `pg` package
- Alternatives: `node-postgres`, `postgres-js`, `neon-http`

**3. Create Connection:**
```javascript
const db = drizzle(process.env.DATABASE_URL);
```
- Creates Drizzle instance connected to database
- This `db` object is used for all queries

**Connection String Format:**
```
postgres://username:password@host:port/database
          ↓
postgres://postgres:miheer@localhost:5432/bookstore
```

**Why this step?**
This creates a reusable database connection that all your application files can import and use.

---

### **STEP 8: Push Schema to Database**

Now that schema is defined, create the actual table in PostgreSQL:

```bash
npx drizzle-kit push
```

**What happens:**
1. Drizzle Kit reads your `schema.js`
2. Connects to your database
3. Compares schema with database state
4. Generates and executes SQL to create tables

**Expected Output:**
```
✓ Pulling schema from database...
✓ Changes detected
CREATE TABLE "bookstore" (
  "id" INTEGER PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "author" VARCHAR(255) NOT NULL,
  "publishedYear" INTEGER
);
✓ Changes applied
```

**Verify in Database:**
```bash
# Connect to PostgreSQL
docker exec -it 01_orm-postgres-1 psql -U postgres -d bookstore

# List tables
\dt

# Describe table structure
\d bookstore

# Exit
\q
```

**Why this step?**
The schema in your code is just JavaScript. This command actually creates the table structure in PostgreSQL.

---

### **STEP 9: Create Main Application File**

**File:** `index.js`

Create functions to interact with the database:

```javascript
const db = require('./db');
const {booksTable} = require('./drizzle/schema');

async function getAllBooks() { 
    const books = await db.select().from(booksTable);
    console.log("books from getAllBooks:", books);
    return books;
}

getAllBooks();

async function createBook(title, author, publishedYear) {
    const [newBook] = await db.insert(booksTable).values({
        title,
        author,
        published_year: publishedYear,
    }).returning();
    return newBook;
}

// Example usage:
createBook('New Book', 'New Author', 2024);
createBook('New Book 2', 'New Author 2', 2025);
```

**Code Breakdown:**

**1. Import Dependencies:**
```javascript
const db = require('./db');
const {booksTable} = require('./drizzle/schema');
```
- `db`: Database connection from Step 7
- `booksTable`: Schema definition from Step 6

**2. Select Query (Read):**
```javascript
async function getAllBooks() { 
    const books = await db.select().from(booksTable);
    return books;
}
```

**Query Builder Breakdown:**
```javascript
db.select()           // SELECT *
  .from(booksTable)   // FROM bookstore
```

**Equivalent SQL:**
```sql
SELECT * FROM bookstore;
```

**3. Insert Query (Create):**
```javascript
async function createBook(title, author, publishedYear) {
    const [newBook] = await db.insert(booksTable)
        .values({
            title,
            author,
            published_year: publishedYear,
        })
        .returning();
    return newBook;
}
```

**Query Builder Breakdown:**
```javascript
db.insert(booksTable)      // INSERT INTO bookstore
  .values({ ... })          // VALUES (...)
  .returning()              // RETURNING *
```

**Equivalent SQL:**
```sql
INSERT INTO bookstore (title, author, published_year)
VALUES ('New Book', 'New Author', 2024)
RETURNING *;
```

**Why `.returning()`?**
- Returns the inserted row
- Useful for getting auto-generated IDs
- `[newBook]` destructures the first element from array

**Why this step?**
This demonstrates CRUD operations (Create, Read) using Drizzle's query builder.

---

### **STEP 10: Add NPM Scripts**

**File:** `package.json`

Add convenient scripts:

```json
{
  "scripts": {
    "start": "node --watch index.js"
  }
}
```

**Script Breakdown:**

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `node --watch index.js` | Run with auto-reload on file changes |

**Alternative Scripts:**
```json
{
  "scripts": {
    "start": "node --watch index.js",
    "dev": "nodemon index.js",
    "migrate": "npx drizzle-kit push",
    "studio": "npx drizzle-kit studio"
  }
}
```

---

## ▶️ Running the Application

### Start the Database:
```bash
docker-compose up -d
```

### Push Schema to Database:
```bash
npx drizzle-kit push
```

### Run the Application:
```bash
npm start
```

**Expected Output:**
```
books from getAllBooks: []
books from getAllBooks: [
  {
    id: 1,
    title: 'New Book',
    author: 'New Author',
    publishedYear: 2024
  },
  {
    id: 2,
    title: 'New Book 2',
    author: 'New Author 2',
    publishedYear: 2025
  }
]
```

---

## 🧠 Understanding the Code

### Query Flow Diagram

```
index.js
   ↓
   → Calls getAllBooks()
   ↓
   → db.select().from(booksTable)
   ↓
db/index.js (Connection)
   ↓
   → Drizzle ORM translates to SQL
   ↓
pg Package
   ↓
   → Executes: SELECT * FROM bookstore
   ↓
PostgreSQL Database
   ↓
   → Returns rows
   ↓
Back to index.js
   ↓
   → console.log(books)
```

### Common Drizzle Queries

#### **1. Select All:**
```javascript
const books = await db.select().from(booksTable);
```

#### **2. Select with Where:**
```javascript
const { eq } = require('drizzle-orm');
const book = await db.select()
    .from(booksTable)
    .where(eq(booksTable.id, 1));
```

#### **3. Insert:**
```javascript
const newBook = await db.insert(booksTable)
    .values({ title: 'Title', author: 'Author' })
    .returning();
```

#### **4. Update:**
```javascript
const updated = await db.update(booksTable)
    .set({ title: 'New Title' })
    .where(eq(booksTable.id, 1))
    .returning();
```

#### **5. Delete:**
```javascript
const deleted = await db.delete(booksTable)
    .where(eq(booksTable.id, 1))
    .returning();
```

---

## 🎯 Key Takeaways

1. **Setup Order Matters**: Docker → .env → Config → Schema → Connection → Code
2. **Schema is Truth**: Your schema file defines database structure
3. **Type Safety**: Drizzle provides TypeScript autocomplete
4. **SQL-Like**: Query builder mirrors SQL syntax
5. **Lightweight**: Minimal overhead compared to traditional ORMs

---

## 🚀 Next Steps

- Add update and delete operations
- Implement error handling
- Create relationships between tables
- Add validation with Zod
- Build a REST API with Express
- Add authentication

---

## 📚 Additional Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Docker Compose Guide](https://docs.docker.com/compose/)

---

**Happy Learning! 🎉**
