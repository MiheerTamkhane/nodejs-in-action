# Node.js in Action 🚀

A comprehensive, hands-on learning repository for mastering Node.js from fundamentals to building production-ready applications.

## 📚 Learning Syllabus

This repository follows a progressive learning path, starting with core Node.js concepts and gradually advancing to building complete web applications. Each section contains practical examples and mini-projects to solidify your understanding.

---

### **Prerequisites**
- Basic JavaScript knowledge (ES6+)
- Understanding of asynchronous programming concepts
- Node.js installed (v14 or higher)
- Code editor (VS Code recommended)

---

## 🎯 Learning Path

### **Phase 1: Node.js Fundamentals**

#### 1. **Core Modules & Module System**
**Files:** `index.js`, `math.js`, `files.js`

Learn the building blocks of Node.js:
- **Module System**: Understanding `require()` and `module.exports`
- **Creating Custom Modules**: Build reusable modules for your applications
- **Core Modules**: Work with built-in modules (`fs`, `os`, `path`)
- **File System Operations**: Read/write files synchronously and asynchronously
- **OS Module**: Access system information and resources

**Key Concepts:**
- CommonJS module pattern
- Synchronous vs Asynchronous file operations
- Error handling in Node.js

---

#### 2. **Events & Event-Driven Architecture** 📁 `01_events/`
**Files:** `myEvents.js`, `myEventsClass.js`, `myErrorEvents.js`, `chatApp/`

Master the event-driven nature of Node.js:
- **EventEmitter Basics**: Creating and listening to events
- **Event Methods**: `on()`, `once()`, `emit()`, `removeListener()`
- **Custom Event Emitters**: Extending EventEmitter class
- **Error Events**: Handling errors in event-driven code
- **Real-World Application**: Building a chat room system

**Projects:**
- **Chat Room Application**: A functional chat system demonstrating:
  - User management (join/leave)
  - Message broadcasting
  - Event-driven communication
  - Class-based EventEmitter implementation

**Key Concepts:**
- Observer pattern
- Event-driven programming
- Class inheritance in Node.js
- Real-time communication patterns

---

#### 3. **Buffers & Binary Data** 📁 `02_buffers/`
**Files:** `buffers.js`

Understanding low-level data handling:
- **Buffer Creation**: `Buffer.alloc()`, `Buffer.from()`
- **Buffer Operations**: Reading, writing, and manipulating binary data
- **Encoding**: Working with different character encodings (UTF-8, ASCII)
- **Buffer Concatenation**: Merging multiple buffers
- **Practical Use Cases**: File I/O, network communication, image processing

**Key Concepts:**
- Binary data representation
- Memory allocation
- Character encoding
- Buffer vs String performance

---

### **Phase 2: HTTP & Web Servers**

#### 4. **HTTP Server Fundamentals** 📁 `http-server/`
**Files:** `index.ts`, `README.md`

Build web servers from scratch using Node.js HTTP module:
- **Creating HTTP Servers**: Using `http.createServer()`
- **Request/Response Cycle**: Understanding req and res objects
- **Routing**: Handling different routes and HTTP methods
- **Request Methods**: GET, POST, PUT, DELETE
- **Reading Request Body**: Parsing incoming data
- **Response Headers**: Setting content types and status codes

**Project Features:**
- RESTful endpoints for tweet management
- In-memory data storage
- Request logging with timestamps
- Error handling and 404 responses

**Key Concepts:**
- HTTP protocol
- RESTful API design
- Streams and chunks
- Request parsing

---

#### 5. **Server with File System Integration** 📁 `server-with-fs-module/`
**Files:** `index.js`, `logs.txt`

Combine HTTP servers with file system operations:
- **Request Logging**: Write logs to files
- **Asynchronous File Operations**: Non-blocking I/O
- **Timestamps**: Track user activity
- **Error Handling**: File operation error management

**Key Concepts:**
- Combining multiple Node.js modules
- Persistent data storage
- Logging strategies
- Callback patterns

---

### **Phase 3: Express.js Framework**

#### 6. **Introduction to Express.js** 📁 `01_express/`
**Files:** `index.ts`, `README.md`

Transition from raw HTTP to Express framework:
- **Express Setup**: Installing and configuring Express
- **Express Basics**: App initialization and middleware
- **Port Configuration**: Server setup and listening
- **Express vs Raw HTTP**: Understanding the benefits

**Key Concepts:**
- Framework vs library
- Express middleware concept
- Simplified routing
- Development workflow

---

#### 7. **Building RESTful APIs with Express** 📁 `express-book-store/`
**Files:** `index.js`, `package.json`

Create a full-featured REST API:
- **CRUD Operations**: Create, Read, Update, Delete
- **Route Parameters**: Dynamic routing with `:id`
- **Request Body Parsing**: Using `express.json()` middleware
- **Response Formatting**: Structured API responses
- **Status Codes**: Proper HTTP status code usage
- **Error Handling**: 404 and validation errors

**Project: Book Store API**
- GET `/books` - Fetch all books
- GET `/books/:id` - Fetch single book by ID
- POST `/books` - Add new book
- PUT `/books/:id` - Update existing book
- DELETE `/books/:id` - Remove book

**Key Concepts:**
- REST API principles
- CRUD pattern
- Middleware stack
- JSON responses
- API testing with Postman/Thunder Client

---

## 🛠️ Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/MiheerTamkhane/nodejs-in-action.git
cd nodejs-in-action

# Install dependencies (for specific projects)
cd 01_express && npm install
cd ../express-book-store && npm install
cd ../http-server && npm install
```

### Running Examples

```bash
# Basic modules
node index.js
node math.js
node files.js

# Events examples
cd 01_events
node myEvents.js
node myEventsClass.js
node myErrorEvents.js
node chatApp/index.js

# Buffers
cd 02_buffers
node buffers.js

# HTTP Server
cd http-server
npm start

# Express servers
cd 01_express
npm start

cd express-book-store
npm start
```

---

## 📖 Learning Tips

1. **Follow the Order**: Start from Phase 1 and progress sequentially
2. **Hands-On Practice**: Run every example and modify the code
3. **Build Projects**: Try creating your own variations of the examples
4. **Read the Docs**: Supplement with [official Node.js documentation](https://nodejs.org/docs/)
5. **Debug**: Use `console.log()` liberally to understand code flow
6. **Experiment**: Break things and fix them to deepen understanding

---

## 🎯 Learning Outcomes

After completing this syllabus, you will be able to:
- ✅ Understand Node.js architecture and event loop
- ✅ Build custom modules and organize code effectively
- ✅ Implement event-driven applications
- ✅ Handle binary data and file operations
- ✅ Create HTTP servers from scratch
- ✅ Build RESTful APIs with Express.js
- ✅ Handle asynchronous operations confidently
- ✅ Structure Node.js applications properly
- ✅ Debug and troubleshoot Node.js applications

---

## 🔄 Next Steps

After mastering these concepts, consider exploring:
- **Databases**: MongoDB, PostgreSQL with Node.js
- **Authentication**: JWT, OAuth, Sessions
- **Testing**: Jest, Mocha, Supertest
- **WebSockets**: Real-time bidirectional communication
- **Microservices**: Building scalable architectures
- **Deployment**: Docker, AWS, Heroku
- **TypeScript**: Type-safe Node.js development

---

## 📚 Additional Resources

- [Node.js Official Documentation](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MDN Web Docs - HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🤝 Contributing

Feel free to contribute by:
- Adding more examples
- Improving documentation
- Fixing bugs
- Suggesting new topics

---

## 📝 License

This project is open source and available for learning purposes.

---

**Happy Learning! 🎉**


