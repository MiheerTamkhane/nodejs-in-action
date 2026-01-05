# Express Book Store API 📚

A complete RESTful API built with Express.js demonstrating CRUD operations, middleware, routing, and logging patterns. Perfect for learning Express fundamentals and building production-ready REST APIs.

---

## 📖 Table of Contents

1. [What Is This Project?](#-what-is-this-project)
2. [Why Express.js?](#-why-expressjs)
3. [Project Architecture](#-project-architecture)
4. [Learning Path](#-learning-path)
5. [File Structure & Execution Order](#-file-structure--execution-order)
6. [Core Concepts Explained](#-core-concepts-explained)
7. [File-by-File Documentation](#-file-by-file-documentation)
8. [API Endpoints Reference](#-api-endpoints-reference)
9. [Request/Response Flow](#-requestresponse-flow)
10. [Running the Project](#-running-the-project)
11. [Testing the API](#-testing-the-api)
12. [Key Takeaways](#-key-takeaways)

---

## 🎯 What Is This Project?

This is a **RESTful API for managing a book collection** with full CRUD operations:

- **C**reate: Add new books
- **R**ead: Get all books or a specific book by ID
- **U**pdate: (Not implemented yet, but architecture supports it)
- **D**elete: Remove books by ID

**Key Features**:
- ✅ Express.js framework for routing and middleware
- ✅ RESTful API design following HTTP standards
- ✅ In-memory database for learning (no external DB needed)
- ✅ Request logging middleware
- ✅ Proper HTTP status codes (200, 201, 404)
- ✅ JSON request/response handling
- ✅ Route parameters for dynamic URLs
- ✅ Modular architecture with separation of concerns

---

## 🤔 Why Express.js?

### The Problem: Raw Node.js HTTP is Verbose

With raw Node.js HTTP module:
```javascript
// You need to manually:
- Parse URL paths
- Handle different HTTP methods with switch statements
- Parse request bodies manually
- Set headers every time
- Manage routes with complex if/else logic
```

### The Solution: Express.js Simplifies Everything

Express provides:
1. **Routing**: Simple, declarative route definitions
2. **Middleware**: Reusable request processing functions
3. **Request Parsing**: Automatic JSON body parsing
4. **Response Helpers**: `.json()`, `.status()`, `.send()` methods
5. **Route Parameters**: Extract values from URLs easily

### Real-World Comparison

**Raw Node.js (from http-server example)**:
```javascript
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/books') {
    // Handle GET /books
  } else if (req.method === 'POST' && req.url === '/books') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => { /* process */ });
  }
  // ... more if/else chains
});
```

**Express.js (this project)**:
```javascript
app.get('/books', (req, res) => { /* handle */ });
app.post('/books', (req, res) => { /* handle */ });
// Clean, declarative, maintainable
```

**Winner**: Express is cleaner, more maintainable, and industry-standard.

---

## 🏗️ Project Architecture

This project follows a **layered architecture** pattern:

```
┌─────────────────────────────────────────────────┐
│           CLIENT (Browser, Postman)             │
└────────────────────┬────────────────────────────┘
                     │ HTTP Request
                     ↓
┌─────────────────────────────────────────────────┐
│              index.js (Entry Point)             │
│  - Initialize Express app                       │
│  - Register middleware                          │
│  - Mount routes                                 │
│  - Start server                                 │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ↓                         ↓
┌──────────────┐          ┌──────────────┐
│  Middleware  │          │    Routes    │
│    Layer     │          │    Layer     │
├──────────────┤          ├──────────────┤
│ • JSON Parser│          │ books.routes │
│ • Logger     │          │  - GET /     │
└──────┬───────┘          │  - GET /:id  │
       │                  │  - POST /    │
       │                  │  - DELETE /:id│
       │                  └──────┬───────┘
       │                         │
       └────────┬────────────────┘
                │
                ↓
        ┌───────────────┐
        │   Data Layer  │
        │   db/books.js │
        │  (In-Memory)  │
        └───────────────┘
```

### Layered Architecture Benefits

1. **Separation of Concerns**: Each layer has one job
2. **Maintainability**: Changes in one layer don't affect others
3. **Testability**: Each layer can be tested independently
4. **Scalability**: Easy to add new routes, middleware, or data sources

---

## 🎓 Learning Path

This project builds on previous concepts:

```
1. Raw HTTP Server (http-server/)
   ↓ (You learned: HTTP basics, request/response)
   
2. Express Basics (01_express/)
   ↓ (You learned: Express initialization)
   
3. THIS PROJECT: Complete REST API
   ↓ (You learn: Routes, middleware, CRUD, logging)
   
4. Next: MVC Architecture (book-store-MVC/)
   (You'll learn: Controllers, models, views)
```

**Progressive Complexity**:
- ✅ HTTP fundamentals
- ✅ Express framework
- ✅ RESTful patterns
- ✅ Middleware concepts
- ⏭️ MVC architecture (next step)

---

## 📁 File Structure & Execution Order

```
express-book-store/
├── package.json              # Dependencies & project config
├── index.js                  # Application entry point (START HERE)
├── middlewares/
│   └── logger.js            # Request logging middleware
├── routes/
│   └── books.routes.js      # Book API routes & handlers
├── db/
│   └── books.js             # In-memory data store
├── server.log               # Generated log file (auto-created)
└── README.md                # This file
```

### Why This Structure?

1. **index.js**: Central configuration, easy to see entire app setup
2. **middlewares/**: Reusable request processing logic
3. **routes/**: API endpoints organized by resource
4. **db/**: Data layer separated from business logic

### Execution Order (Request Lifecycle)

```
1. Server starts (index.js)
   ↓
2. Client sends HTTP request
   ↓
3. express.json() parses request body
   ↓
4. loggerMiddleware logs request details
   ↓
5. Route handler executes (books.routes.js)
   ↓
6. Data accessed/modified (db/books.js)
   ↓
7. Response sent back to client
   ↓
8. Logger writes to server.log
```

---

## 💡 Core Concepts Explained

### 1. Express Application

```javascript
const express = require('express');
const app = express();
```

**What is `app`?**: An Express application instance that:
- Handles HTTP requests
- Manages middleware
- Defines routes
- Starts the server

Think of `app` as your entire web server configured in code.

### 2. Middleware

**Definition**: Functions that process requests before they reach route handlers.

**Signature**:
```javascript
function middleware(req, res, next) {
  // Do something with request/response
  next();  // Pass control to next middleware/route
}
```

**Three Parameters**:
- `req`: Request object (data from client)
- `res`: Response object (send data to client)
- `next`: Function to call next middleware

**Execution Order**:
```javascript
app.use(middleware1);  // Runs first
app.use(middleware2);  // Runs second
app.get('/route', handler);  // Runs third (if GET request matches)
```

**Key Concept**: Middleware is a **chain**. Each calls `next()` to pass control.

### 3. Routing

**Basic Route Structure**:
```javascript
app.METHOD(PATH, HANDLER)
```

- **METHOD**: HTTP method (get, post, put, delete)
- **PATH**: URL pattern ('/books', '/books/:id')
- **HANDLER**: Function to execute when route matches

**Route Parameters**:
```javascript
app.get('/books/:id', (req, res) => {
  const id = req.params.id;  // Extract from URL
});
```

URL: `/books/5` → `req.params.id === '5'`

### 4. Request & Response Objects

**Request (req)**:
- `req.params`: URL parameters (`:id`)
- `req.query`: Query strings (`?search=term`)
- `req.body`: Parsed request body (JSON)
- `req.method`: HTTP method (GET, POST, etc.)
- `req.originalUrl`: Full URL path

**Response (res)**:
- `res.json(data)`: Send JSON response
- `res.status(code)`: Set HTTP status code
- `res.send(data)`: Send any response
- Method chaining: `res.status(404).json({error: 'Not found'})`

### 5. HTTP Status Codes

- **200 OK**: Successful GET/DELETE
- **201 Created**: Successful POST (resource created)
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server-side errors

---

## 📄 File-by-File Documentation

### 📦 package.json

**Purpose**: Project metadata and dependency management.

**Contents**:
```json
{
  "name": "express-book-store",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node --watch index.js"
  },
  "dependencies": {
    "@types/express": "^5.0.6",
    "express": "^5.2.1"
  }
}
```

**Key Fields Explained**:

- **name**: Project identifier
- **version**: Semantic versioning (major.minor.patch)
- **main**: Entry point file
- **scripts.start**: Command to run the app
  - `node --watch`: Auto-restarts server on file changes (built-in hot reload)
- **dependencies**:
  - `express`: The web framework (runtime dependency)
  - `@types/express`: TypeScript type definitions (for IDE autocomplete)

**Why @types/express?**: Provides IntelliSense/autocomplete in VS Code even though we're using JavaScript.

**Running the Script**:
```bash
npm start  # Executes "node --watch index.js"
```

---

### 📘 index.js (Application Entry Point)

**Purpose**: Initialize Express app, configure middleware, mount routes, and start server.

**Complete Code Analysis**:

```javascript
const express = require('express');
const app = express();
const port = 3000;
```

**Line-by-Line**:
1. Import Express framework
2. Create Express application instance
3. Define port number (3000 is common for development)

```javascript
const {loggerMiddleware} = require('./middlewares/logger');
const booksRoute = require('./routes/books.routes');
```

**Imports**:
- `loggerMiddleware`: Custom middleware for request logging
- `booksRoute`: Router containing all book-related routes

**Why Destructuring?**: `{loggerMiddleware}` extracts named export. `booksRoute` imports default export.

```javascript
// Middlewares
app.use(express.json());
app.use(loggerMiddleware);
```

**Middleware Registration**:

1. **express.json()**: Built-in middleware
   - Parses incoming JSON request bodies
   - Makes data available at `req.body`
   - **Must be before routes** that read `req.body`

2. **loggerMiddleware**: Custom middleware
   - Logs all incoming requests
   - Runs for every request (no path specified)

**Execution Order**: JSON parser → Logger → Routes

```javascript
// Routes
app.use('/books', booksRoute);
```

**Route Mounting**:
- **'/books'**: Base path for all book routes
- **booksRoute**: Router handling book-specific endpoints

**How It Works**:
- Request to `/books` → Handled by `booksRoute`
- Request to `/books/5` → Also handled by `booksRoute`
- The '/books' prefix is stripped before the router sees it

**Mental Model**:
```
/books/* → booksRoute
  ├── / (relative to /books) → GET all books
  ├── /:id (relative to /books) → GET book by ID
  ├── / (relative to /books) → POST new book
  └── /:id (relative to /books) → DELETE book
```

```javascript
app.listen(port, () => {
  console.log(`Book store app listening at http://localhost:${port}`);
});
```

**Server Initialization**:
- `app.listen(port, callback)`: Starts HTTP server
- **port**: Server listens on port 3000
- **callback**: Runs once server is ready
- Server blocks here, waiting for requests

**What Happens**:
1. Binds to port 3000
2. Prints confirmation message
3. Waits for incoming HTTP requests
4. Each request flows through middleware → routes

**Summary**: This file is the **orchestrator**. It doesn't contain business logic—it configures and connects components.

---

### 📗 middlewares/logger.js

**Purpose**: Log every HTTP request with timestamp, method, and URL for debugging and monitoring.

**Complete Code Analysis**:

```javascript
const fs = require('node:fs');
```

**Import**: Node.js file system module for writing logs to disk.

**Why 'node:fs'?**: The `node:` prefix explicitly indicates built-in Node.js module (newer convention).

```javascript
exports.loggerMiddleware = (req, res, next) => {
```

**Middleware Function Signature**:
- **req**: Incoming request object
- **res**: Response object (not used here)
- **next**: Function to call next middleware

**Named Export**: Uses `exports.loggerMiddleware` for explicit naming.

```javascript
    const log = `\n${new Date().toISOString()} - ${req.method} ${req.originalUrl}`;
```

**Log Format**:
- `\n`: Newline (each log on separate line)
- `new Date().toISOString()`: Timestamp in ISO format (2026-01-05T10:30:45.123Z)
- `req.method`: HTTP method (GET, POST, DELETE)
- `req.originalUrl`: Full URL path including query strings

**Example Output**:
```
2026-01-05T10:30:45.123Z - GET /books
2026-01-05T10:30:52.456Z - POST /books
2026-01-05T10:31:03.789Z - GET /books/1
```

```javascript
    fs.appendFileSync('server.log', log, 'utf-8');
```

**File Writing**:
- **appendFileSync**: Synchronously append to file
  - Creates 'server.log' if it doesn't exist
  - Appends (doesn't overwrite) existing content
  - **Sync vs Async**: Blocks execution until write completes

**Why Synchronous?**: 
- ✅ Ensures log is written before moving to next middleware
- ✅ Prevents race conditions
- ⚠️ Blocks event loop (okay for logging, not for heavy I/O)

**Production Alternative**: Use async logging libraries (Winston, Pino) for better performance.

```javascript
    next();
}
```

**Critical**: Calls `next()` to pass control to next middleware/route.

**What Breaks Without `next()`**: Request hangs forever. Client times out. Always call `next()` in middleware unless you're sending a response.

**Flow Diagram**:
```
Request arrives
    ↓
Logger middleware executes
    ↓
Format log string
    ↓
Write to server.log
    ↓
Call next()
    ↓
Next middleware/route executes
```

**Use Cases**:
- **Debugging**: See what requests your server receives
- **Monitoring**: Track API usage patterns
- **Auditing**: Record who accessed what and when
- **Error Tracking**: Correlate errors with specific requests

---

### 📙 db/books.js (Data Layer)

**Purpose**: Provide in-memory data storage for books. This simulates a database without external dependencies.

**Complete Code Analysis**:

```javascript
exports.BOOKS = [
  { id: 1, title: "Book One", author: "Author One" },
  { id: 2, title: "Book Two", author: "Author Two" },
];
```

**Data Structure**:
- **Array**: Stores multiple book objects
- **Each book**: Has `id`, `title`, `author` properties
- **Named Export**: `BOOKS` can be imported by name

**Why This Design?**:

1. **Simplicity**: No database setup required for learning
2. **Mutability**: Array can be modified (add/remove books)
3. **Real Reference**: Imported by reference, changes persist across requests
4. **Educational**: Focus on Express, not database configuration

**Data Persistence**:
- ✅ **Within Session**: Data persists across requests while server runs
- ❌ **Across Restarts**: Data resets when server restarts

**Example Usage**:
```javascript
const {BOOKS} = require('../db/books');

// Read
console.log(BOOKS);  // All books

// Add
BOOKS.push({id: 3, title: "New Book", author: "New Author"});

// Delete
BOOKS.splice(index, 1);

// Find
const book = BOOKS.find(b => b.id === 1);
```

**Real-World Evolution**:
```
In-Memory Array (Learning)
    ↓
File-Based Storage (JSON files)
    ↓
SQL Database (PostgreSQL, MySQL)
    ↓
NoSQL Database (MongoDB)
    ↓
ORM (Drizzle, Prisma, Sequelize)
```

**Next Step**: See `book-store-MVC` or `01_ORM` for database integration.

---

### 📕 routes/books.routes.js (Route Handlers)

**Purpose**: Define all book-related API endpoints and their logic.

**Complete Code Analysis**:

```javascript
const express = require('express');
const route = express.Router();
```

**Express Router**:
- `express.Router()`: Creates a modular, mountable route handler
- Think of it as a mini-Express app focused on one resource
- Can be mounted at a path in the main app

**Why Router?**: 
- Organizes routes by resource (books, users, orders)
- Keeps main app file clean
- Enables route modularity and reusability

```javascript
const {BOOKS} = require('../db/books');
```

**Data Import**: Gets reference to books array from data layer.

**Important**: This is a **reference**, not a copy. Changes to `BOOKS` affect the original.

---

#### 📌 GET / - Fetch All Books

```javascript
route.get('/', (req, res) => {
    const response = {
    status: 'success',
    data: BOOKS,
    length: BOOKS.length
  };
  res.json(response);
});
```

**Route**: `GET /books/` (base path + this route)

**Logic**:
1. Creates response object with:
   - `status`: Success indicator
   - `data`: All books from array
   - `length`: Number of books (metadata)
2. Sends JSON response (automatic Content-Type: application/json)

**HTTP Status**: 200 OK (implicit default)

**Example Request**:
```
GET http://localhost:3000/books
```

**Example Response**:
```json
{
  "status": "success",
  "data": [
    {"id": 1, "title": "Book One", "author": "Author One"},
    {"id": 2, "title": "Book Two", "author": "Author Two"}
  ],
  "length": 2
}
```

**API Design Pattern**: Wrapping data in a structured response with status and metadata.

---

#### 📌 GET /:id - Fetch Single Book

```javascript
route.get('/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const book = BOOKS.find(b => b.id === bookId);

  if (book) {
    res.json({
      status: 'success',
      data: book
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Book not found'
    });
  }
});
```

**Route**: `GET /books/:id` (`:id` is a route parameter)

**Logic Step-by-Step**:

1. **Extract ID from URL**:
   ```javascript
   const bookId = parseInt(req.params.id, 10);
   ```
   - URL: `/books/5` → `req.params.id === '5'` (string)
   - `parseInt(string, radix)`: Converts to integer
   - **radix 10**: Parse as decimal number
   - Result: `bookId = 5` (number)

2. **Find Book**:
   ```javascript
   const book = BOOKS.find(b => b.id === bookId);
   ```
   - `Array.find()`: Returns first matching element or `undefined`
   - Searches for book where `id` matches `bookId`

3. **Success Case**:
   ```javascript
   if (book) {
     res.json({status: 'success', data: book});
   }
   ```
   - Book found → Return 200 OK with book data

4. **Error Case**:
   ```javascript
   else {
     res.status(404).json({status: 'error', message: 'Book not found'});
   }
   ```
   - Book not found → Return 404 Not Found with error message

**Example Request**:
```
GET http://localhost:3000/books/1
```

**Example Response (Success)**:
```json
{
  "status": "success",
  "data": {"id": 1, "title": "Book One", "author": "Author One"}
}
```

**Example Response (Not Found)**:
```
GET http://localhost:3000/books/999

HTTP/1.1 404 Not Found
{
  "status": "error",
  "message": "Book not found"
}
```

**Why parseInt?**: Route parameters are always strings. Must convert for numeric comparison.

---

#### 📌 POST / - Add New Book

```javascript
route.post('/', (req, res) => {
    const body = req.body;
    const newBook = {
    id: BOOKS.length + 1,
    ...body
    }
    BOOKS.push(newBook);
    res.status(201).json({
        status: 'success',
        data: newBook
    });
});
```

**Route**: `POST /books/`

**Logic Step-by-Step**:

1. **Extract Request Body**:
   ```javascript
   const body = req.body;
   ```
   - Client sends JSON in request body
   - `express.json()` middleware parses it
   - Available as JavaScript object at `req.body`

2. **Create New Book**:
   ```javascript
   const newBook = {
     id: BOOKS.length + 1,
     ...body
   }
   ```
   - **Auto-increment ID**: Current length + 1
   - **Spread operator (`...body`)**: Copies all properties from body
   - Client sends `{title, author}` → Gets `{id, title, author}`

   **Example**:
   ```javascript
   // body = {title: "New Book", author: "New Author"}
   // BOOKS.length = 2
   // Result:
   newBook = {
     id: 3,
     title: "New Book",
     author: "New Author"
   }
   ```

3. **Add to Array**:
   ```javascript
   BOOKS.push(newBook);
   ```
   - Mutates original `BOOKS` array
   - Persists for future requests (until server restarts)

4. **Send Response**:
   ```javascript
   res.status(201).json({
     status: 'success',
     data: newBook
   });
   ```
   - **201 Created**: Proper status for resource creation
   - Returns newly created book (including generated ID)

**Example Request**:
```
POST http://localhost:3000/books
Content-Type: application/json

{
  "title": "Node.js in Action",
  "author": "Miheer"
}
```

**Example Response**:
```
HTTP/1.1 201 Created

{
  "status": "success",
  "data": {
    "id": 3,
    "title": "Node.js in Action",
    "author": "Miheer"
  }
}
```

**Missing Features** (Improvement Opportunities):
- ⚠️ No validation (title/author required?)
- ⚠️ No duplicate checking
- ⚠️ ID generation vulnerable to race conditions

**Production Approach**: Use database auto-increment IDs, validate inputs, handle errors.

---

#### 📌 DELETE /:id - Remove Book

```javascript
route.delete('/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const bookIndex = BOOKS.findIndex(b => b.id === bookId);

  if (bookIndex !== -1) {
    BOOKS.splice(bookIndex, 1);
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
});
```

**Route**: `DELETE /books/:id`

**Logic Step-by-Step**:

1. **Extract ID**:
   ```javascript
   const bookId = parseInt(req.params.id, 10);
   ```
   - Same as GET /:id, convert string to number

2. **Find Index**:
   ```javascript
   const bookIndex = BOOKS.findIndex(b => b.id === bookId);
   ```
   - `Array.findIndex()`: Returns index of first match, or -1 if not found
   - **Why index?**: Need position to remove from array

3. **Success Case**:
   ```javascript
   if (bookIndex !== -1) {
     BOOKS.splice(bookIndex, 1);
   ```
   - `Array.splice(start, deleteCount)`: Removes elements
   - `splice(bookIndex, 1)`: Remove 1 element at bookIndex
   - **Mutates** original array (book is actually deleted)

   ```javascript
     res.json({
       status: 'success',
       message: 'Book deleted successfully'
     });
   }
   ```
   - 200 OK (default)
   - Confirmation message

4. **Error Case**:
   ```javascript
   else {
     res.status(404).json({
       status: 'error',
       message: 'Book not found'
     });
   }
   ```
   - Book doesn't exist → 404 Not Found

**Example Request**:
```
DELETE http://localhost:3000/books/1
```

**Example Response (Success)**:
```json
{
  "status": "success",
  "message": "Book deleted successfully"
}
```

**Example Response (Not Found)**:
```
DELETE http://localhost:3000/books/999

HTTP/1.1 404 Not Found
{
  "status": "error",
  "message": "Book not found"
}
```

**Why findIndex + splice?**:
- `filter()` creates new array (doesn't mutate)
- `splice()` modifies original array (what we want)
- Need index to know where to splice

---

```javascript
module.exports = route;
```

**Export**: Makes router available for import in index.js.

**Summary**: This file contains all CRUD logic for books. It's a complete sub-application focused on one resource.

---

## 🔄 API Endpoints Reference

### Complete API Documentation

| Method | Endpoint | Description | Request Body | Success Response | Error Response |
|--------|----------|-------------|--------------|------------------|----------------|
| GET | `/books` | Get all books | None | 200 + books array | - |
| GET | `/books/:id` | Get single book | None | 200 + book object | 404 if not found |
| POST | `/books` | Create book | `{title, author}` | 201 + created book | - |
| DELETE | `/books/:id` | Delete book | None | 200 + success message | 404 if not found |

### Response Format Standards

**Success Response**:
```json
{
  "status": "success",
  "data": {...},
  "message": "..." // optional
}
```

**Error Response**:
```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## 🌊 Request/Response Flow

### Complete Lifecycle Example: GET /books/1

```
1. Client sends request:
   GET http://localhost:3000/books/1

2. Request enters Express app (index.js)

3. Middleware Chain:
   ├─ express.json()
   │  └─ Parses JSON body (none for GET)
   │
   ├─ loggerMiddleware
   │  ├─ Creates log: "2026-01-05... - GET /books/1"
   │  ├─ Writes to server.log
   │  └─ Calls next()
   │
   └─ Route matching
      └─ Matches: app.use('/books', booksRoute)

4. Router (books.routes.js):
   ├─ Strips '/books' prefix
   ├─ Route: GET /:id matches '/1'
   ├─ req.params.id = '1'
   │
   └─ Handler executes:
      ├─ Parse ID: bookId = 1
      ├─ Find book in BOOKS array
      ├─ Found? → 200 + book data
      └─ Not found? → 404 + error

5. Response sent to client:
   HTTP/1.1 200 OK
   Content-Type: application/json
   
   {"status": "success", "data": {...}}

6. Connection closed
```

### Visualization: POST /books

```
Client                    Server                      Data
  │                         │                          │
  │  POST /books           │                          │
  │  {title, author}       │                          │
  ├───────────────────────>│                          │
  │                         │                          │
  │                         │ express.json()           │
  │                         │ (parse body)            │
  │                         │                          │
  │                         │ loggerMiddleware         │
  │                         │ (write log)             │
  │                         │                          │
  │                         │ Route: POST /           │
  │                         │                          │
  │                         │ Create newBook          │
  │                         │ (id = length + 1)       │
  │                         │                          │
  │                         │ BOOKS.push(newBook) ───>│
  │                         │                          │ [Add book]
  │                         │                          │
  │                         │ Build response          │
  │                         │                          │
  │  201 Created           │                          │
  │  {status, data}        │                          │
  │<────────────────────────│                          │
  │                         │                          │
```

---

## 🚀 Running the Project

### Prerequisites

- Node.js installed (v14+)
- npm (comes with Node.js)
- Terminal/Command line
- API testing tool (Postman, Thunder Client, or curl)

### Installation & Setup

```bash
# Navigate to project directory
cd express-book-store

# Install dependencies
npm install

# Start the server
npm start
```

**Expected Output**:
```
Book store app listening at http://localhost:3000
```

**What Happens**:
1. npm reads package.json
2. Executes `node --watch index.js`
3. Server starts on port 3000
4. Watches for file changes (auto-restarts)

### Verify Installation

Open browser: `http://localhost:3000/books`

Should see:
```json
{
  "status": "success",
  "data": [
    {"id": 1, "title": "Book One", "author": "Author One"},
    {"id": 2, "title": "Book Two", "author": "Author Two"}
  ],
  "length": 2
}
```

---

## 🧪 Testing the API

### Option 1: Browser (GET requests only)

```
http://localhost:3000/books
http://localhost:3000/books/1
http://localhost:3000/books/2
```

### Option 2: curl (Command Line)

**Get all books**:
```bash
curl http://localhost:3000/books
```

**Get single book**:
```bash
curl http://localhost:3000/books/1
```

**Create book**:
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title":"New Book","author":"New Author"}'
```

**Delete book**:
```bash
curl -X DELETE http://localhost:3000/books/1
```

### Option 3: Postman / Thunder Client

**GET All Books**:
- Method: GET
- URL: `http://localhost:3000/books`
- Send

**GET Single Book**:
- Method: GET
- URL: `http://localhost:3000/books/1`
- Send

**POST New Book**:
- Method: POST
- URL: `http://localhost:3000/books`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "title": "Express.js Guide",
    "author": "John Doe"
  }
  ```
- Send

**DELETE Book**:
- Method: DELETE
- URL: `http://localhost:3000/books/1`
- Send

### Testing Workflow

```bash
# Terminal 1: Start server
npm start

# Terminal 2: Test endpoints
curl http://localhost:3000/books                           # List books
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","author":"Me"}'                      # Add book
curl http://localhost:3000/books/3                         # View new book
curl -X DELETE http://localhost:3000/books/3               # Delete book
curl http://localhost:3000/books/3                         # Verify deleted (404)

# Check logs
cat server.log
```

**Expected server.log**:
```
2026-01-05T10:00:00.123Z - GET /books
2026-01-05T10:00:05.456Z - POST /books
2026-01-05T10:00:10.789Z - GET /books/3
2026-01-05T10:00:15.012Z - DELETE /books/3
2026-01-05T10:00:20.345Z - GET /books/3
```

---

## 🎯 Key Takeaways

### Express Fundamentals

1. **Express simplifies Node.js HTTP**:
   - Declarative routing
   - Middleware system
   - Built-in parsers and helpers

2. **Middleware is powerful**:
   - Runs before route handlers
   - Enables cross-cutting concerns (logging, auth, parsing)
   - Chain with `next()`

3. **Routers organize code**:
   - Group related routes
   - Create modular, maintainable APIs
   - Mount at base paths

### REST API Design

1. **HTTP methods have meaning**:
   - GET: Read data
   - POST: Create data
   - PUT/PATCH: Update data
   - DELETE: Remove data

2. **Status codes matter**:
   - 200: Success
   - 201: Created
   - 404: Not found
   - 500: Server error

3. **Consistent response format**:
   - Wrap data in objects
   - Include status/error indicators
   - Provide helpful messages

### Architecture Patterns

1. **Separation of concerns**:
   - Routes: Define endpoints
   - Middleware: Cross-cutting logic
   - Data layer: Manage state

2. **Layered architecture**:
   - Each layer has one responsibility
   - Easy to test and maintain
   - Scalable structure

3. **Module organization**:
   - One file per concern
   - Export/import for composition
   - Clear dependencies

### Common Patterns You Learned

✅ Application initialization  
✅ Middleware registration  
✅ Route parameter extraction  
✅ JSON parsing and response  
✅ Error handling (404s)  
✅ File-based logging  
✅ In-memory data storage  
✅ CRUD operations  
✅ HTTP status codes  
✅ RESTful URL design  

---

## 🔄 Next Steps

### Immediate Improvements

1. **Add validation**:
   ```javascript
   if (!req.body.title || !req.body.author) {
     return res.status(400).json({error: 'Title and author required'});
   }
   ```

2. **Add PUT route** (update book):
   ```javascript
   route.put('/:id', (req, res) => {
     // Find and update logic
   });
   ```

3. **Error handling middleware**:
   ```javascript
   app.use((err, req, res, next) => {
     res.status(500).json({error: err.message});
   });
   ```

4. **Environment variables**:
   ```javascript
   const port = process.env.PORT || 3000;
   ```

### Learning Path Progression

```
✅ Raw HTTP (http-server/)
✅ THIS PROJECT: Express + REST API
⏭️ MVC Architecture (book-store-MVC/)
⏭️ Database Integration (01_ORM/)
⏭️ Full Stack (todolist-with-orm-mvc/)
```

### Advanced Topics to Explore

1. **Database Integration**: Replace in-memory array with PostgreSQL/MongoDB
2. **Authentication**: JWT tokens, sessions, OAuth
3. **Validation**: express-validator, Joi
4. **Error Handling**: Centralized error middleware
5. **Testing**: Jest, Supertest for API testing
6. **Documentation**: Swagger/OpenAPI specs
7. **Security**: Helmet, rate limiting, CORS
8. **Production**: PM2, Docker, logging services

---

## 📚 Additional Resources

- [Express.js Official Docs](https://expressjs.com/)
- [RESTful API Design](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [MDN - HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🐛 Common Issues & Solutions

### Issue: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
const port = 3001;
```

### Issue: Cannot POST/GET

**Problem**: Wrong HTTP method

**Solution**: Verify method matches route:
- `app.get()` → GET requests only
- `app.post()` → POST requests only

### Issue: req.body is undefined

**Problem**: Forgot `express.json()` middleware

**Solution**: Add before routes:
```javascript
app.use(express.json());
```

### Issue: Changes not reflecting

**Problem**: Server not restarting

**Solution**: Use `--watch` flag:
```bash
node --watch index.js
```

---

**Happy Coding! 🎉**

Master Express, and you're ready to build production APIs.