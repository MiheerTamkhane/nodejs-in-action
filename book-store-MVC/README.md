# Book Store MVC - Complete Guide 📚

A comprehensive, production-ready Node.js REST API built using the **Model-View-Controller (MVC)** architectural pattern with Express.js. This project demonstrates industry-standard API design, separation of concerns, middleware implementation, and request logging.

---

## 📋 Table of Contents

1. [What This Project Does](#what-this-project-does)
2. [Why MVC Architecture?](#why-mvc-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Learning & Execution Order](#learning--execution-order)
6. [File-by-File Documentation](#file-by-file-documentation)
7. [Packages & Dependencies](#packages--dependencies)
8. [Data Flow Explanation](#data-flow-explanation)
9. [Setup & Running](#setup--running)
10. [API Endpoints](#api-endpoints)
11. [Common Errors & Fixes](#common-errors--fixes)

---

## 🎯 What This Project Does

This is a **RESTful API** for managing a book store inventory. It allows you to:

- ✅ **View all books** in the store
- ✅ **View a specific book** by ID
- ✅ **Add new books** to inventory
- ✅ **Delete books** from inventory
- ✅ **Log all requests** to a file for monitoring

**Key Features:**
- Clean separation of concerns using MVC pattern
- Automatic request logging middleware
- Structured JSON responses
- Error handling with proper HTTP status codes
- Hot reload during development

---

## 🏗️ Why MVC Architecture?

### The Problem Without MVC

Imagine all your code in one file:

```javascript
// ❌ Everything mixed together - Hard to maintain
app.get('/books', (req, res) => {
  const books = [/* data */];  // Data
  const filtered = books.filter(/* logic */);  // Logic
  res.json(filtered);  // Response
});
```

**Problems:**
- Cannot reuse logic
- Hard to test
- Changes in one place break everything
- Difficult to scale

### The MVC Solution

MVC separates code into three distinct layers:

```
┌─────────────────────────────────────────────┐
│          REQUEST from Client                │
│         (GET /books/1)                      │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  ROUTES (books.routes.js)                   │
│  • Defines URL patterns                     │
│  • Maps HTTP methods to controllers         │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  CONTROLLERS (book.controller.js)           │
│  • Handles request/response                 │
│  • Coordinates between Model and Response   │
│  • Formats responses                        │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  MODELS (book.js)                          │
│  • Data structure definition                │
│  • Data storage (in-memory or database)     │
│  • Business rules for data                  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│          RESPONSE to Client                 │
│    { status: 'success', data: {...} }       │
└─────────────────────────────────────────────┘
```

**Benefits:**
- ✅ **Separation of Concerns**: Each layer has one job
- ✅ **Reusability**: Controllers can use multiple models
- ✅ **Testability**: Test each layer independently
- ✅ **Maintainability**: Changes in UI don't affect data logic
- ✅ **Scalability**: Easy to add new features

---

## 🛠️ Technology Stack

### Why Node.js?

**Node.js** is a JavaScript runtime built on Chrome's V8 engine.

**Chosen because:**
- **Single Language**: JavaScript on both frontend and backend
- **Event-Driven**: Perfect for I/O-heavy operations (APIs, file handling)
- **NPM Ecosystem**: Massive package registry
- **Fast Development**: Quick prototyping and development
- **Non-Blocking I/O**: Handles multiple requests efficiently

**Use Cases:**
- ✅ REST APIs
- ✅ Real-time applications (chat, notifications)
- ✅ Microservices
- ❌ CPU-intensive tasks (video encoding, machine learning)

---

### Why Express.js?

**Express** is a minimal, flexible Node.js web framework.

**Historical Context:**
- Created in 2010 by TJ Holowaychuk
- Became the de facto standard for Node.js web apps
- Powers major companies: Uber, IBM, Accenture

**Why Express?**
- **Minimalist**: Only provides essentials (routing, middleware)
- **Unopinionated**: Freedom to structure your app
- **Middleware System**: Plug-and-play functionality
- **Large Ecosystem**: Thousands of compatible packages
- **Performance**: Lightweight and fast

**Alternatives:**
- **Koa**: More modern, uses async/await (created by Express team)
- **Fastify**: Faster, schema-based
- **Hapi**: Enterprise-focused, configuration-heavy
- **NestJS**: TypeScript-first, Angular-like

---

## 📁 Project Structure

```
book-store-MVC/
│
├── index.js                    # Application entry point
├── package.json                # Dependencies & scripts
│
├── models/                     # Data layer
│   └── book.js                 # Book data structure & storage
│
├── controllers/                # Business logic layer
│   └── book.controller.js      # Request handling & response formatting
│
├── routes/                     # Routing layer
│   └── books.routes.js         # URL to controller mapping
│
├── middlewares/                # Cross-cutting concerns
│   └── logger.js               # Request logging middleware
│
└── views/                      # (Empty - API only, no UI)
```

**Why This Structure?**

| Folder | Purpose | Analogy |
|--------|---------|---------|
| `models/` | Data storage & structure | Database/Filing Cabinet |
| `controllers/` | Business logic | Manager who makes decisions |
| `routes/` | URL mapping | Receptionist who directs requests |
| `middlewares/` | Pre-processing | Security guard checking everyone |
| `views/` | UI templates | Store display (unused in APIs) |

---

## 📖 Learning & Execution Order

Follow this exact sequence to understand the project:

### Phase 1: Foundation (Setup)
1. **package.json** - Understand dependencies
2. **index.js** - Application entry point

### Phase 2: Data Layer
3. **models/book.js** - Where data lives

### Phase 3: Logic Layer
4. **controllers/book.controller.js** - How data is manipulated

### Phase 4: Routing Layer
5. **routes/books.routes.js** - How URLs work

### Phase 5: Cross-Cutting Concerns
6. **middlewares/logger.js** - Request interception

---

## 📄 File-by-File Documentation

### 1️⃣ `package.json`

**📌 Purpose:**
Defines project metadata, dependencies, and scripts.

**Why It Exists:**
- NPM needs this to manage packages
- Scripts automate common tasks
- Version tracking for reproducible builds

**Content Breakdown:**

```json
{
  "name": "book-store-mvc",
  "version": "1.0.0",
  "main": "index.js",           // Entry point
  "scripts": {
    "start": "node --watch index.js"  // Hot reload on changes
  },
  "dependencies": {
    "@types/express": "^5.0.6",    // TypeScript definitions
    "express": "^5.2.1"            // Web framework
  }
}
```

**Scripts Explained:**
- `npm start`: Runs the server with auto-restart on file changes
- `--watch`: Node.js built-in flag for hot reload (Node 18+)

**Who Depends On This:**
- NPM package manager
- All developers working on the project
- Deployment systems

**Impact If Removed:**
Cannot install dependencies or run scripts.

---

### 2️⃣ `index.js` (Entry Point)

**📌 Purpose:**
Application bootstrap and server initialization.

**Why It Exists:**
Every Node.js application needs an entry point that:
1. Initializes the framework
2. Configures middleware
3. Registers routes
4. Starts the server

**Code Walkthrough:**

```javascript
const express = require('express');
const app = express();
const port = 3000;
const {loggerMiddleware} = require('./middlewares/logger');
const booksRoute = require('./routes/books.routes');

// Middlewares
app.use(express.json());        // Parse JSON request bodies
app.use(loggerMiddleware);      // Log all requests

// Routes
app.use('/books', booksRoute);  // Mount book routes at /books

app.listen(port, () => {
  console.log(`Book store app listening at http://localhost:${port}`);
});
```

**Execution Order:**
1. Import dependencies
2. Create Express app
3. Register middlewares (run on EVERY request)
4. Register routes (define URL patterns)
5. Start HTTP server on port 3000

**Why This Order Matters:**
- Middleware must be registered BEFORE routes
- Routes must be registered BEFORE `listen()`
- If you reverse the order, requests won't be processed correctly

**Who Depends On This:**
- This is the root file - nothing depends on it, but it depends on everything

**Impact If Removed:**
Application cannot start.

---

### 3️⃣ `models/book.js`

**📌 Purpose:**
Data storage and structure definition.

**Why It Exists:**
In MVC, the Model layer:
- Defines what data looks like
- Stores data (in-memory here, database in production)
- Provides data access interface

**Code:**

```javascript
exports.BOOKS = [
  { id: 1, title: "Book One", author: "Author One" },
  { id: 2, title: "Book Two", author: "Author Two" },
];
```

**Data Structure:**
Each book object has:
- `id`: Unique identifier (integer)
- `title`: Book name (string)
- `author`: Author name (string)

**Storage Type:**
- **In-Memory**: Data stored in JavaScript array
- **Lifetime**: Data resets when server restarts
- **Use Case**: Development, prototyping, demos

**Production Alternative:**
```javascript
// Replace with database (PostgreSQL, MongoDB)
const db = require('./db');
exports.getBooks = () => db.query('SELECT * FROM books');
```

**Who Depends On This:**
- `controllers/book.controller.js` (reads/writes data)

**Impact If Removed:**
Controllers cannot access data - API breaks.

**Note:** The controller imports from `'../db/books'` but this file is at `models/book.js`. This is likely a mistake that should be fixed.

---

### 4️⃣ `controllers/book.controller.js`

**📌 Purpose:**
Business logic and request/response handling.

**Why It Exists:**
Controllers are the "brain" of the application:
- Receive requests from routes
- Process data using models
- Format responses
- Handle errors

**Code Breakdown:**

#### Function 1: Get All Books

```javascript
const { BOOKS } = require('../db/books');  // Import data

exports.getAllbooks = (req, res) => {
  const response = {
    status: 'success',
    data: BOOKS,
    length: BOOKS.length
  };
  res.json(response);
};
```

**What It Does:**
- Fetches entire BOOKS array
- Wraps in structured response
- Sends JSON to client

**Response Format:**
```json
{
  "status": "success",
  "data": [/* books */],
  "length": 2
}
```

---

#### Function 2: Get Book by ID

```javascript
exports.getBookById = (req, res) => {
  const bookId = parseInt(req.params.id, 10);  // URL parameter
  const book = BOOKS.find(b => b.id === bookId);

  if (book) {
    res.json({ status: 'success', data: book });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Book not found'
    });
  }
};
```

**What It Does:**
1. Extracts `id` from URL (`/books/1` → `id = 1`)
2. Converts to integer (URL params are strings)
3. Searches BOOKS array
4. Returns book OR 404 error

**HTTP Status Codes:**
- `200`: Success (implicit with `res.json()`)
- `404`: Not Found (explicit with `res.status(404)`)

---

#### Function 3: Add New Book

```javascript
exports.addNewBook = (req, res) => {
  const body = req.body;  // JSON from request body
  const newBook = {
    id: BOOKS.length + 1,  // Auto-increment ID
    ...body                // Spread operator: title, author
  };
  BOOKS.push(newBook);
  res.status(201).json({
    status: 'success',
    data: newBook
  });
};
```

**What It Does:**
1. Reads JSON from request body
2. Creates new book with auto-generated ID
3. Adds to BOOKS array
4. Returns created book with 201 status

**HTTP Status Code:**
- `201`: Created (resource successfully created)

**Request Body Example:**
```json
{
  "title": "New Book",
  "author": "New Author"
}
```

---

#### Function 4: Delete Book by ID

```javascript
exports.deleteBookById = (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const bookIndex = BOOKS.findIndex(b => b.id === bookId);

  if (bookIndex !== -1) {
    BOOKS.splice(bookIndex, 1);  // Remove from array
    res.json({
      status: 'success',
      message: 'Book deleted successfully'
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Book not found'
    });
  }
};
```

**What It Does:**
1. Finds book index in array
2. Removes using `splice()`
3. Returns success OR 404

**Why `findIndex` instead of `find`?**
- `find()` returns the object
- `findIndex()` returns position (needed for `splice()`)

---

**Who Depends On This:**
- `routes/books.routes.js` (calls these functions)

**Impact If Removed:**
Routes exist but have no logic - API returns nothing.

---

### 5️⃣ `routes/books.routes.js`

**📌 Purpose:**
URL pattern definition and HTTP method mapping.

**Why It Exists:**
Routes act as the "receptionist" that:
- Maps URLs to controller functions
- Defines which HTTP method does what
- Provides clean API interface

**Code:**

```javascript
const express = require('express');
const route = express.Router();  // Create router instance
const {
  getAllBooks,
  getBookById,
  addNewBook,
  deleteBookById
} = require('../controllers/books.controller');

// GET Route to Fetch All Books
route.get('/', getAllBooks);

// GET Route to Fetch a Book by ID
route.get('/:id', getBookById);

// POST Route to Add a New Book
route.post('/', addNewBook);

// DELETE Route to Remove a Book by ID
route.delete('/:id', deleteBookById);

module.exports = route;
```

**Route Mapping:**

| HTTP Method | URL | Controller | Purpose |
|-------------|-----|------------|---------|
| `GET` | `/books` | `getAllBooks` | List all books |
| `GET` | `/books/:id` | `getBookById` | Get single book |
| `POST` | `/books` | `addNewBook` | Create book |
| `DELETE` | `/books/:id` | `deleteBookById` | Remove book |

**URL Parameters:**
- `:id` is a placeholder
- Express extracts it: `req.params.id`
- Example: `/books/5` → `req.params.id === "5"`

**Why `express.Router()`?**
- Creates modular route handlers
- Allows mounting at different paths
- `index.js` mounts this at `/books`
- Enables multiple route files

**Who Depends On This:**
- `index.js` (registers this router)

**Impact If Removed:**
All `/books/*` URLs return 404.

**Note:** There's a typo - controller exports `getAllbooks` (lowercase 'b') but route imports `getAllBooks` (uppercase 'B'). This will cause a runtime error.

---

### 6️⃣ `middlewares/logger.js`

**📌 Purpose:**
Request logging for monitoring and debugging.

**Why It Exists:**
Middleware functions run BEFORE route handlers:
- Logging
- Authentication
- Request parsing
- CORS handling

**Code:**

```javascript
const fs = require('node:fs');

exports.loggerMiddleware = (req, res, next) => {
  const log = `\n${new Date().toISOString()} - ${req.method} ${req.originalUrl}`;
  fs.appendFileSync('server.log', log, 'utf-8');
  next();  // Pass control to next middleware/route
};
```

**What It Does:**

1. **Captures request info:**
   - Timestamp: `2026-01-02T10:30:45.123Z`
   - HTTP method: `GET`, `POST`, `DELETE`
   - URL: `/books/1`

2. **Writes to file:**
   - `server.log` in root directory
   - Appends (doesn't overwrite)
   - Synchronous write (blocks execution)

3. **Calls `next()`:**
   - Passes control to next middleware or route
   - Without `next()`, request hangs forever

**Example Log File:**
```
2026-01-02T10:30:45.123Z - GET /books
2026-01-02T10:31:10.456Z - GET /books/1
2026-01-02T10:32:00.789Z - POST /books
```

**Middleware Chain:**

```
Request
  ↓
express.json()         // Parse JSON body
  ↓
loggerMiddleware       // Log request
  ↓
Route Handler          // Controller function
  ↓
Response
```

**Why Synchronous?**
- `appendFileSync` blocks execution
- **Bad for production** (slows every request)
- **Better alternative:**
  ```javascript
  fs.appendFile('server.log', log, 'utf-8', (err) => {
    if (err) console.error(err);
  });
  next();  // Don't wait for file write
  ```

**Who Depends On This:**
- `index.js` (registers this middleware)

**Impact If Removed:**
No request logging - harder to debug issues.

---

### 7️⃣ `views/` (Empty Folder)

**📌 Purpose:**
Intended for HTML templates (not used in API-only apps).

**Why It Exists:**
Traditional MVC web apps render HTML:
- Views are HTML templates (EJS, Pug, Handlebars)
- Controllers pass data to views
- Views render dynamic HTML

**Why Empty Here?**
This is a **REST API**, not a traditional web app:
- Returns JSON, not HTML
- Consumed by frontend frameworks (React, Vue)
- No server-side rendering needed

**If This Were a Full-Stack App:**
```
views/
├── books.ejs           // List all books
├── book-detail.ejs     // Single book page
└── add-book.ejs        // Form to add book
```

**Who Depends On This:**
- Nobody (unused in this project)

**Impact If Removed:**
None - can be safely deleted.

---

## 📦 Packages & Dependencies

### 1. **express** (v5.2.1)

**What Problem It Solves:**
Node.js HTTP module is too low-level:

```javascript
// ❌ Without Express - Tedious
const http = require('http');
http.createServer((req, res) => {
  if (req.url === '/books' && req.method === 'GET') {
    // Parse URL, handle routing manually
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(books));
  }
}).listen(3000);
```

```javascript
// ✅ With Express - Simple
app.get('/books', (req, res) => res.json(books));
```

**Why It Was Created:**
- 2010: Node.js HTTP module was cumbersome
- TJ Holowaychuk created Express for simplicity
- Inspired by Sinatra (Ruby framework)

**Why Chosen:**
- Industry standard (most popular Node.js framework)
- Extensive middleware ecosystem
- Well-documented and stable
- Easy learning curve

**Runtime Critical?**
✅ **Yes** - Core dependency, cannot run without it.

---

### 2. **@types/express** (v5.0.6)

**What Problem It Solves:**
TypeScript needs type definitions for JavaScript libraries.

**Why It Exists:**
- Express is written in JavaScript
- TypeScript doesn't know Express types
- `@types/*` packages provide type definitions

**Why Included:**
- Better IDE autocomplete
- Catch errors before runtime
- Improved developer experience

**Do You Need This?**
- ✅ **If using TypeScript**: Yes
- ❌ **If using JavaScript only**: No (can be removed)

**Runtime Critical?**
❌ **No** - Dev-only dependency, not used in production.

---

### 3. **node:fs** (Built-in Module)

**What Problem It Solves:**
File system operations (read, write, delete files).

**Why Used:**
Logger middleware writes to `server.log` file.

**No Installation Needed:**
Built into Node.js (hence `node:fs` prefix).

---

## 🔄 Data Flow Explanation

### Example: GET /books/1

**Step-by-Step Request Flow:**

```
┌──────────────────────────────────────────────┐
│  1. Client Request                           │
│     GET http://localhost:3000/books/1        │
└───────────────────┬──────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│  2. Express Receives Request                 │
│     • Parses HTTP headers                    │
│     • Creates req and res objects            │
└───────────────────┬──────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│  3. Middleware #1: express.json()            │
│     • Parses request body (if JSON)          │
│     • Adds to req.body                       │
│     • Calls next()                           │
└───────────────────┬──────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│  4. Middleware #2: loggerMiddleware          │
│     • Logs: "2026-01-02T... - GET /books/1"  │
│     • Writes to server.log                   │
│     • Calls next()                           │
└───────────────────┬──────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│  5. Route Matching                           │
│     • Express checks registered routes       │
│     • Finds: GET /books/:id                  │
│     • Extracts: req.params.id = "1"          │
│     • Calls: getBookById(req, res)           │
└───────────────────┬──────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│  6. Controller: getBookById                  │
│     • Parses id: parseInt("1") → 1           │
│     • Queries model: BOOKS.find(b => b.id==1)│
│     • Formats response                       │
└───────────────────┬──────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│  7. Model: BOOKS array                       │
│     • Returns: { id: 1, title: ..., ... }    │
└───────────────────┬──────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│  8. Controller Sends Response                │
│     • res.json({status: 'success', data: ...})│
│     • Sets Content-Type: application/json    │
│     • Status: 200 OK                         │
└───────────────────┬──────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│  9. Response to Client                       │
│     HTTP/1.1 200 OK                          │
│     {                                        │
│       "status": "success",                   │
│       "data": {                              │
│         "id": 1,                             │
│         "title": "Book One",                 │
│         "author": "Author One"               │
│       }                                      │
│     }                                        │
└──────────────────────────────────────────────┘
```

---

### Example: POST /books (Create New Book)

```
Client sends:
  POST http://localhost:3000/books
  Body: { "title": "New Book", "author": "John Doe" }
    ↓
express.json() parses body
    ↓
loggerMiddleware logs request
    ↓
Route matches POST /books
    ↓
Controller: addNewBook(req, res)
  • Creates: { id: 3, title: "New Book", author: "John Doe" }
  • Pushes to BOOKS array
    ↓
Model: BOOKS array updated
    ↓
Controller responds: 201 Created
    ↓
Client receives created book
```

---

## 🚀 Setup & Running

### Prerequisites

- **Node.js** v18 or higher (for `--watch` flag)
- **npm** (comes with Node.js)
- **Code Editor** (VS Code recommended)
- **API Client** (Postman, Thunder Client, or curl)

---

### Installation Steps

**1. Clone or navigate to project:**
```bash
cd book-store-MVC
```

**2. Install dependencies:**
```bash
npm install
```

This installs:
- `express` (web framework)
- `@types/express` (TypeScript definitions)

**3. Verify installation:**
```bash
npm list
```

Expected output:
```
book-store-mvc@1.0.0
├── @types/express@5.0.6
└── express@5.2.1
```

---

### Running the Server

**Start the application:**
```bash
npm start
```

Expected output:
```
Book store app listening at http://localhost:3000
```

**What happens:**
- Node.js runs `index.js`
- Express starts HTTP server on port 3000
- `--watch` flag monitors file changes and restarts automatically

**Stop the server:**
Press `Ctrl + C`

---

### Testing the API

**1. Using curl (Terminal):**

```bash
# Get all books
curl http://localhost:3000/books

# Get book by ID
curl http://localhost:3000/books/1

# Add new book
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","author":"Test Author"}'

# Delete book
curl -X DELETE http://localhost:3000/books/1
```

**2. Using Postman/Thunder Client:**

Create requests:
- **GET** `http://localhost:3000/books`
- **GET** `http://localhost:3000/books/1`
- **POST** `http://localhost:3000/books` (with JSON body)
- **DELETE** `http://localhost:3000/books/1`

**3. Using Browser:**

Open: `http://localhost:3000/books`
(Only works for GET requests)

---

## 📡 API Endpoints

### 1. Get All Books

**Request:**
```http
GET /books
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    { "id": 1, "title": "Book One", "author": "Author One" },
    { "id": 2, "title": "Book Two", "author": "Author Two" }
  ],
  "length": 2
}
```

---

### 2. Get Book by ID

**Request:**
```http
GET /books/1
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Book One",
    "author": "Author One"
  }
}
```

**Error (404 Not Found):**
```json
{
  "status": "error",
  "message": "Book not found"
}
```

---

### 3. Add New Book

**Request:**
```http
POST /books
Content-Type: application/json

{
  "title": "New Book",
  "author": "New Author"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "id": 3,
    "title": "New Book",
    "author": "New Author"
  }
}
```

---

### 4. Delete Book

**Request:**
```http
DELETE /books/1
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Book deleted successfully"
}
```

**Error (404 Not Found):**
```json
{
  "status": "error",
  "message": "Book not found"
}
```

---

## ⚠️ Common Errors & Fixes

### Error 1: "Cannot GET /books"

**Cause:** Server not running or wrong URL

**Fix:**
```bash
# Start the server
npm start

# Verify URL
curl http://localhost:3000/books
```

---

### Error 2: "TypeError: getAllBooks is not a function"

**Cause:** Function name mismatch between controller and routes

**Current Issue:**
- Controller exports: `getAllbooks` (lowercase 'b')
- Route imports: `getAllBooks` (uppercase 'B')

**Fix in `controllers/book.controller.js`:**
```javascript
// Change this:
exports.getAllbooks = (req, res) => { ... }

// To this:
exports.getAllBooks = (req, res) => { ... }
```

---

### Error 3: "Cannot find module '../db/books'"

**Cause:** Controller tries to import from non-existent path

**Current Issue:**
```javascript
const { BOOKS } = require('../db/books');  // Wrong path
```

**Fix in `controllers/book.controller.js`:**
```javascript
const { BOOKS } = require('../models/book');  // Correct path
```

---

### Error 4: Port 3000 already in use

**Cause:** Another process using port 3000

**Fix:**

**Option 1: Kill existing process**
```bash
# Find process on port 3000
lsof -ti:3000

# Kill it
kill -9 $(lsof -ti:3000)
```

**Option 2: Use different port**
```javascript
// In index.js
const port = 4000;  // Change port
```

---

### Error 5: Request body is undefined

**Cause:** Missing `express.json()` middleware

**Fix in `index.js`:**
```javascript
// Add this BEFORE routes
app.use(express.json());
```

---

## 🎓 Learning Outcomes

After understanding this project, you should be able to:

✅ Explain the MVC architectural pattern  
✅ Build RESTful APIs with Express.js  
✅ Create modular route handlers  
✅ Implement custom middleware  
✅ Handle HTTP methods and status codes  
✅ Structure Node.js applications professionally  
✅ Debug common Express issues  
✅ Understand request/response lifecycle  

---

## 🚀 Next Steps

### Beginner Level:
- Add input validation (check title/author are not empty)
- Add UPDATE endpoint (PUT /books/:id)
- Return better error messages

### Intermediate Level:
- Replace in-memory storage with database (PostgreSQL, MongoDB)
- Add authentication (JWT tokens)
- Implement pagination for large datasets
- Add search/filter functionality

### Advanced Level:
- Add TypeScript for type safety
- Implement unit and integration tests (Jest, Supertest)
- Add API documentation (Swagger/OpenAPI)
- Containerize with Docker
- Deploy to cloud (AWS, Heroku, Vercel)

---

## 📚 Additional Resources

- [Express.js Official Docs](https://expressjs.com/)
- [MDN: HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🐛 Known Issues

1. **Function Name Mismatch**: `getAllbooks` vs `getAllBooks` - causes runtime error
2. **Wrong Import Path**: `'../db/books'` should be `'../models/book'`
3. **Synchronous File Write**: `fs.appendFileSync` blocks requests - use async version
4. **No Input Validation**: Can create books with missing fields
5. **ID Generation**: Simple `BOOKS.length + 1` breaks if books are deleted

---

## 📝 License

Open source - available for learning purposes.

---

**Built with ❤️ for learning Node.js and MVC architecture**
