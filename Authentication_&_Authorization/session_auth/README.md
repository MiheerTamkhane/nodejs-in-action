# Session-Based Authentication System

A production-ready implementation of **session-based authentication** in Node.js using Express, PostgreSQL, and Drizzle ORM. This project demonstrates how to build secure user authentication from scratch without relying on third-party libraries like Passport.js.

## 📚 What This Project Does

This application provides a complete authentication system where:
- Users can **sign up** with email and password
- Passwords are securely **hashed and salted** using Node.js crypto
- Users can **log in** and receive a unique session ID
- Sessions are stored in a PostgreSQL database
- Protected routes verify session validity before granting access
- Session IDs are passed via HTTP headers for API authentication

This is a **stateful authentication** pattern (server stores session data), as opposed to stateless JWT authentication.

---

## 🎯 Why Session-Based Authentication?

### What is Session-Based Authentication?
Session-based auth stores user login state **on the server**. When a user logs in:
1. Server creates a session record in the database
2. Returns a unique session ID to the client
3. Client sends this session ID with every request
4. Server validates the session ID against the database

### Why Use It?
- **Server control**: Sessions can be invalidated instantly (logout, security breach)
- **Better security**: No sensitive data stored on client side
- **Ideal for traditional web apps**: Works seamlessly with cookies
- **Audit trail**: All active sessions are visible in the database

### Session vs JWT
| Feature | Session-Based | JWT |
|---------|---------------|-----|
| Storage | Server (database) | Client (browser) |
| Revocation | Instant | Requires blacklist |
| Scalability | Requires shared storage | Stateless, scales easily |
| Security | Token never leaves server | Token exposed to client |
| Use case | Traditional apps | Distributed systems, SPAs |

---

## 🏗️ Project Architecture

This project follows a **layered architecture** pattern:

```
session_auth/
├── index.js              # Application entry point & middleware setup
├── routes/               # API endpoint definitions
│   └── user.routes.js    # User authentication routes
├── middlewares/          # Request interceptors
│   └── auth.middleware.js # Session validation logic
├── db/                   # Database layer
│   ├── index.js          # Database connection
│   └── schema.js         # Table definitions
├── drizzle/              # Database migrations
└── drizzle.config.js     # ORM configuration
```

### Why This Structure?
- **Separation of concerns**: Each layer has a single responsibility
- **Maintainability**: Changes to DB don't affect routes
- **Testability**: Each layer can be tested independently
- **Scalability**: Easy to add new features without touching existing code

---

## 📦 Technologies & Packages Used

### Runtime & Core
| Package | Version | Purpose | Why This Choice? |
|---------|---------|---------|-------------------|
| **Node.js** | v20+ | JavaScript runtime | Required for server-side JavaScript execution |
| **Express** | ^4.22.1 | Web framework | Industry standard, minimal, flexible routing |
| **PostgreSQL** | 17 | Relational database | ACID compliance, data integrity, robust |

### Database & ORM
| Package | Version | Purpose | Why This Choice? |
|---------|---------|---------|-------------------|
| **Drizzle ORM** | ^0.45.1 | Type-safe SQL query builder | Modern alternative to TypeORM/Prisma, better performance |
| **drizzle-kit** | ^0.31.8 | Migration generator | Schema sync and migration management |
| **pg** | ^8.16.3 | PostgreSQL client | Native driver for Node.js, no abstraction overhead |

### Security & Configuration
| Package | Version | Purpose | Why This Choice? |
|---------|---------|---------|-------------------|
| **dotenv** | ^17.2.3 | Environment variable loader | Keeps sensitive data out of code |
| **crypto** | Built-in | Password hashing | Node.js native module, no dependencies |

### Development Tools
| Package | Version | Purpose | Why This Choice? |
|---------|---------|---------|-------------------|
| **tsx** | ^4.21.0 | TypeScript execution | Enables TypeScript support without compilation |
| **--watch** | Built-in | Auto-restart on changes | Faster development cycle |

---

## 🗄️ Database Schema & Design

### Why Two Tables?

#### **users** Table
Stores permanent user account information:
- `id` (UUID): Unique identifier for each user
- `name`: User's display name
- `email`: Login identifier (must be unique)
- `password`: Hashed password (never stored in plain text)
- `salt`: Random string used in hashing (makes rainbow table attacks impossible)

#### **user_sessions** Table
Stores temporary login sessions:
- `id` (UUID): Session identifier sent to client
- `userId` (UUID): Links session to a user (foreign key)
- `createdAt`: When the session was created

### Why Separate Tables?
- **Multiple sessions**: One user can have many active sessions (mobile, web, desktop)
- **Easy logout**: Delete session without touching user data
- **Session expiry**: Can add TTL without affecting user accounts
- **Security**: Compromised session doesn't expose user credentials

### Database Relationships
```
users (1) ────< (many) user_sessions
```
One user can have multiple active sessions across different devices.

---

## 🔐 Security Implementation

### Password Hashing Strategy

**Why not store plain passwords?**
If the database is compromised, attackers get all passwords immediately.

**How we prevent this:**
1. **Generate a salt**: Random 256-byte string unique per user
2. **Hash with HMAC-SHA256**: Combine salt + password → irreversible hash
3. **Store both**: Save `hashedPassword` and `salt` in database

```javascript
const salt = randomBytes(256).toString('hex');
const hashedPassword = createHmac('sha256', salt)
    .update(password)
    .digest('hex');
```

**Why HMAC-SHA256?**
- **One-way function**: Cannot reverse the hash to get the password
- **Deterministic**: Same input always produces same hash (for login verification)
- **Salt prevents rainbow tables**: Pre-computed hash databases become useless
- **Fast enough**: Good balance between security and performance

### Session Security
- **UUID v4**: Cryptographically random, unpredictable session IDs
- **Server-side storage**: Session data never exposed to client
- **Header-based**: Uses `session-id` header instead of cookies (API-friendly)

---

## 📂 File-by-File Breakdown

### 📄 `index.js` (Application Entry Point)
**What it does:**
- Initializes Express server
- Registers routes and middleware
- Implements global authentication middleware

**Why it exists:**
Every Node.js application needs an entry point. This file orchestrates all components.

**Key responsibilities:**
1. **Parse JSON requests**: `app.use(express.json())`
2. **Route registration**: `app.use('/user', router)`
3. **Global auth middleware**: Validates session on every request
4. **Server startup**: Listens on port 3000

**Critical middleware logic:**
```javascript
app.use('/', async (req, res, next) => {
  const sessionId = req.headers['session-id'];
  // Validates session from database
  // Attaches user info to req.user
  // Rejects unauthorized requests
});
```

**Execution flow:**
1. Request arrives
2. JSON parser processes body
3. Route-specific handler runs (if matched)
4. Global auth middleware validates session
5. Protected route handlers execute
6. Response sent back

**Who depends on it:**
This is the root file. Everything else is imported here.

---

### 📄 `db/index.js` (Database Connection)
**What it does:**
Creates and exports a database connection instance.

**Why it exists:**
Centralized database access. All files import `db` from here instead of creating multiple connections.

**How it works:**
```javascript
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL || '');
```

**Why Drizzle?**
- **Type-safe**: Catches SQL errors at development time
- **Zero overhead**: Minimal abstraction over raw SQL
- **Migration support**: Auto-generates SQL from schema changes

**Who depends on it:**
- `routes/user.routes.js` (CRUD operations)
- `index.js` (session validation)

**What breaks if removed:**
Entire application. No database = no data storage.

---

### 📄 `db/schema.js` (Table Definitions)
**What it does:**
Defines the structure of database tables using Drizzle's schema builder.

**Why it exists:**
Schema-first approach. Database structure is defined in code, not manual SQL scripts.

**Key definitions:**

#### `usersTable`
```javascript
export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  salt: text(),
});
```
- **UUID primary key**: Better than auto-incrementing integers (no enumeration attacks)
- **Email uniqueness**: Enforced at database level (prevents duplicates)
- **Text vs Varchar**: Password hashes are variable length

#### `userSessions`
```javascript
export const userSessions = pgTable("user_sessions", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => usersTable.id),
  createdAt: timestamp().defaultNow().notNull(),
});
```
- **Foreign key constraint**: Ensures sessions always link to valid users
- **Timestamp**: Can be used for session expiration logic

**Why schema files matter:**
- **Single source of truth**: Database structure documented in code
- **Version control**: Schema changes tracked in Git
- **Auto-migrations**: Drizzle generates SQL from changes

**Who depends on it:**
- `db/index.js` (imports schemas)
- `routes/user.routes.js` (imports table references)
- `index.js` (imports for queries)

---

### 📄 `routes/user.routes.js` (Authentication Routes)
**What it does:**
Defines all user-related API endpoints (signup, login, profile).

**Why it exists:**
Separates routing logic from application setup. Follows REST principles.

**API Endpoints:**

#### `POST /user/signup`
**Purpose:** Create new user account

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Process:**
1. Check if email already exists
2. Generate random salt (256 bytes)
3. Hash password with salt using HMAC-SHA256
4. Insert user into database
5. Return user ID

**Why salt is critical:**
Without salt, identical passwords have identical hashes. Attackers can use rainbow tables (pre-computed hash databases) to crack passwords instantly.

**Response:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "User created successfully"
}
```

---

#### `POST /user/login`
**Purpose:** Authenticate user and create session

**Request body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Process:**
1. Find user by email
2. Retrieve stored salt
3. Hash provided password with salt
4. Compare with stored hash
5. Create session record in database
6. Return session ID

**Security consideration:**
We return the same error message for "user not found" and "wrong password" to prevent email enumeration attacks.

**Response:**
```json
{
  "message": "Login successfully",
  "sessionId": "794599f3-d5b5-42ac-9986-2b468e74c30a"
}
```

**Client must:**
Store this `sessionId` and send it in `session-id` header for authenticated requests.

---

#### `GET /user/` (Protected Route)
**Purpose:** Get current user profile

**Headers required:**
```
session-id: 794599f3-d5b5-42ac-9986-2b468e74c30a
```

**Process:**
1. Global middleware validates session
2. Attaches user data to `req.user`
3. Route handler returns user info

**Response:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

#### `PATCH /user/` (Protected Route)
**Purpose:** Update user profile

**Headers required:**
```
session-id: 794599f3-d5b5-42ac-9986-2b468e74c30a
```

**Request body:**
```json
{
  "name": "Jane Doe"
}
```

**Process:**
1. Middleware validates session
2. Extracts user ID from `req.user`
3. Updates user record in database
4. Returns success status

---

### 📄 `middlewares/auth.middleware.js` (Route Protection)
**What it does:**
Ensures only authenticated users can access protected routes.

**Why it exists:**
Reusable authentication check. Without this, every route would need duplicate session validation code.

**How it works:**
```javascript
export const ensureAuthenticated = async function (req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'You must be authenticated' });
  }
  next();
};
```

**When it runs:**
After global middleware (which populates `req.user`), before route handler.

**Execution flow:**
```
Request → Global middleware → ensureAuthenticated → Route handler
```

**Why check req.user?**
The global middleware in `index.js` already fetched user data from the session. This middleware just validates it was successful.

**What happens on failure:**
Returns HTTP 401 (Unauthorized) immediately, preventing route handler execution.

**Who depends on it:**
Any route that calls `ensureAuthenticated` before its handler:
- `GET /user/`
- `PATCH /user/`

---

### 📄 `drizzle.config.js` (ORM Configuration)
**What it does:**
Configures Drizzle Kit for database migrations and schema management.

**Why it exists:**
Drizzle needs to know:
- Where your schema is defined
- Where to generate migrations
- How to connect to the database

**Configuration breakdown:**
```javascript
export default defineConfig({
  out: './drizzle',              // Migration files location
  schema: './db/schema.js',      // Schema definition file
  dialect: 'postgresql',         // Database type
  dbCredentials: {
    url: process.env.DATABASE_URL  // Connection string
  },
});
```

**Used by:**
- `npm run db:push` - Sync schema to database
- `npm run db:generate` - Create migration files
- `npm run db:studio` - Launch visual database browser

**Why separate config file?**
Drizzle Kit is a CLI tool, not imported in application code. It needs standalone configuration.

---

### 📄 `docker-compose.yml` (Development Database)
**What it does:**
Defines a PostgreSQL database container for local development.

**Why Docker?**
- **No local installation needed**: Works on any machine with Docker
- **Consistent environment**: Everyone uses the same PostgreSQL version
- **Easy cleanup**: `docker-compose down` removes everything
- **Persistence**: Data survives container restarts via volumes

**Configuration explained:**
```yaml
services:
  db:
    image: postgres:17              # PostgreSQL version
    restart: always                 # Auto-restart on crash
    environment:
      POSTGRES_USER: user           # Database username
      POSTGRES_PASSWORD: mysecretpassword  # Database password
      POSTGRES_DB: session_auth_db  # Database name
    ports:
      - "5432:5432"                 # Map container port to host
    volumes:
      - db_data:/var/lib/postgresql/data  # Persist data
```

**Why port 5432?**
Standard PostgreSQL port. Application connects via:
```
DATABASE_URL=postgresql://user:mysecretpassword@localhost:5432/session_auth_db
```

**Volume purpose:**
Without volumes, data is lost when container stops. Volumes persist data outside the container filesystem.

---

### 📄 `package.json` (Project Metadata)
**What it does:**
Defines project dependencies, scripts, and configuration.

**Why `"type": "module"`?**
Enables ES6 module syntax (`import`/`export`) instead of CommonJS (`require`).

**NPM Scripts explained:**

#### `npm start`
```json
"start": "node --watch index.js"
```
- Runs the application
- `--watch` flag: Auto-restarts on file changes (like nodemon)
- Development-only feature (Node v18+)

#### `npm run db:push`
```json
"db:push": "drizzle-kit push"
```
- Syncs schema changes to database **without migrations**
- Fast for development
- Dangerous in production (can lose data)

#### `npm run db:generate`
```json
"db:generate": "drizzle-kit generate"
```
- Creates migration SQL files from schema changes
- Safe for production
- Tracks schema history

#### `npm run db:studio`
```json
"db:studio": "drizzle-kit studio"
```
- Launches visual database browser
- View/edit data with GUI
- Runs on `https://local.drizzle.studio`

---

## 🔄 Request/Response Flow

### Signup Flow
```
Client                    Server                   Database
  |                         |                          |
  |-- POST /user/signup --->|                          |
  |    (name, email, pwd)   |                          |
  |                         |-- Check email exists -->|
  |                         |<-- Email unique ---------|
  |                         |                          |
  |                         |-- Generate salt          |
  |                         |-- Hash password          |
  |                         |                          |
  |                         |-- INSERT user ---------->|
  |                         |<-- User ID --------------|
  |                         |                          |
  |<-- 201 Created ---------|                          |
  |    { userId: "..." }    |                          |
```

### Login Flow
```
Client                    Server                   Database
  |                         |                          |
  |-- POST /user/login ---->|                          |
  |    (email, password)    |                          |
  |                         |-- Find user by email -->|
  |                         |<-- User + salt ----------|
  |                         |                          |
  |                         |-- Hash password w/ salt  |
  |                         |-- Compare hashes         |
  |                         |                          |
  |                         |-- INSERT session ------->|
  |                         |<-- Session ID -----------|
  |                         |                          |
  |<-- 200 OK --------------|                          |
  |    { sessionId: "..." } |                          |
```

### Protected Route Access
```
Client                    Server                   Database
  |                         |                          |
  |-- GET /user/ ---------->|                          |
  |    Header: session-id   |                          |
  |                         |                          |
  |                         |-- Validate session ----->|
  |                         |<-- User data ------------|
  |                         |                          |
  |                         |-- Check req.user exists  |
  |                         |-- Execute route handler  |
  |                         |                          |
  |<-- 200 OK --------------|                          |
  |    { user: {...} }      |                          |
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v20+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** (for cloning)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd session_auth
```

### Step 2: Install Dependencies
```bash
npm install
```

**What this installs:**
- Express (web server)
- Drizzle ORM + pg (database layer)
- dotenv (environment variables)
- Development tools (drizzle-kit, tsx)

### Step 3: Start PostgreSQL Database
```bash
docker-compose up -d
```

**What happens:**
- Downloads PostgreSQL 17 image (if not cached)
- Starts database container in background (`-d` flag)
- Creates `session_auth_db` database
- Exposes port 5432 on localhost

**Verify it's running:**
```bash
docker ps
```
Should show `postgres:17` container with status "Up".

### Step 4: Configure Environment Variables
Create `.env` file in project root:
```env
DATABASE_URL=postgresql://user:mysecretpassword@localhost:5432/session_auth_db
PORT=3000
```

**Why .env file?**
- Keeps secrets out of version control
- Different values per environment (dev, staging, production)
- Easy to change without code modifications

**Connection string format:**
```
postgresql://[username]:[password]@[host]:[port]/[database]
```

### Step 5: Push Database Schema
```bash
npm run db:push
```

**What this does:**
1. Reads schema from `db/schema.js`
2. Generates CREATE TABLE statements
3. Executes SQL against database
4. Creates `users` and `user_sessions` tables

**Verify schema:**
```bash
npm run db:studio
```
Opens Drizzle Studio in browser. You should see both tables.

### Step 6: Start Application
```bash
npm start
```

**Output:**
```
Server is running on port 3000
```

**Test it:**
```bash
curl http://localhost:3000/
```
Should return: `Hello, World!`

---

## 🧪 Testing the API

### 1. Create a User
```bash
curl -X POST http://localhost:3000/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "mySecurePassword123"
  }'
```

**Expected response:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "User created successfully"
}
```

### 2. Login
```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "mySecurePassword123"
  }'
```

**Expected response:**
```json
{
  "message": "Login successfully",
  "sessionId": "794599f3-d5b5-42ac-9986-2b468e74c30a"
}
```

**Save the sessionId** for next requests.

### 3. Get User Profile (Protected)
```bash
curl http://localhost:3000/user/ \
  -H "session-id: 794599f3-d5b5-42ac-9986-2b468e74c30a"
```

**Expected response:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 4. Update Profile (Protected)
```bash
curl -X PATCH http://localhost:3000/user/ \
  -H "Content-Type: application/json" \
  -H "session-id: 794599f3-d5b5-42ac-9986-2b468e74c30a" \
  -d '{
    "name": "Jane Doe"
  }'
```

**Expected response:**
```json
{
  "status": "success"
}
```

---

## ❌ Common Errors & Fixes

### Error: `ECONNREFUSED ::1:5432`
**Cause:** PostgreSQL container not running

**Fix:**
```bash
docker-compose up -d
```

### Error: `relation "users" does not exist`
**Cause:** Database schema not pushed

**Fix:**
```bash
npm run db:push
```

### Error: `invalid input syntax for type uuid`
**Cause:** Invalid session ID format (not a valid UUID)

**Fix:** Ensure you're passing the correct session ID from login response. Session IDs must be valid UUID v4 format.

### Error: `User with email already exists`
**Cause:** Trying to sign up with existing email

**Fix:** Use a different email or delete the existing user from database.

### Error: `You must be authenticated`
**Cause:** Missing or invalid `session-id` header

**Fix:** 
1. Ensure you logged in and received a session ID
2. Include header: `session-id: <your-session-id>`
3. Verify session exists in database (use Drizzle Studio)

---

## 🔐 Security Best Practices Implemented

✅ **Password hashing with salt** - Prevents rainbow table attacks  
✅ **HMAC-SHA256** - Cryptographically secure hash function  
✅ **UUID session IDs** - Unpredictable, non-enumerable tokens  
✅ **Foreign key constraints** - Data integrity at database level  
✅ **Email uniqueness** - Prevents duplicate accounts  
✅ **Environment variables** - Secrets not in code  
✅ **Generic error messages** - Prevents email enumeration  
✅ **Session-based auth** - Server-controlled revocation  

---

## 🚧 What's Missing (Production Considerations)

This is a **learning project**. For production, add:

### Security
- [ ] **Session expiration** - Auto-logout after inactivity
- [ ] **HTTPS only** - Encrypt all network traffic
- [ ] **Rate limiting** - Prevent brute-force attacks
- [ ] **CSRF protection** - For cookie-based sessions
- [ ] **Input validation** - Sanitize all user inputs
- [ ] **SQL injection prevention** - Use parameterized queries (Drizzle handles this)

### Features
- [ ] **Logout endpoint** - Delete session from database
- [ ] **Password reset** - Email-based recovery
- [ ] **Email verification** - Confirm user owns email
- [ ] **Remember me** - Long-lived sessions
- [ ] **Multiple device management** - List/revoke active sessions

### Infrastructure
- [ ] **Connection pooling** - Reuse database connections
- [ ] **Database indexes** - Faster queries on email, sessionId
- [ ] **Logging** - Winston/Pino for production logs
- [ ] **Error monitoring** - Sentry/Datadog integration
- [ ] **Health check endpoint** - `/health` for load balancers

---

## 📚 Learning Path

**If you're new to this stack, study in this order:**

1. **Node.js basics** - Async/await, modules, crypto
2. **Express fundamentals** - Routing, middleware, request/response
3. **PostgreSQL basics** - Tables, relationships, constraints
4. **SQL queries** - SELECT, INSERT, UPDATE, DELETE, JOIN
5. **Drizzle ORM** - Schema definition, query builder
6. **Authentication concepts** - Hashing, salting, sessions
7. **Docker basics** - Containers, images, volumes, compose

**Recommended next steps:**

- Add session expiration with `expiresAt` timestamp
- Implement logout functionality
- Add password strength validation
- Build a frontend with login/signup forms
- Deploy to production (Vercel/Railway/Render)

---

## 🎓 Interview Preparation

### Key Concepts to Explain

**1. Why hash passwords?**
- Plain passwords in database = catastrophic breach
- Hashing is one-way (cannot reverse)
- Rainbow tables make unsalted hashes vulnerable
- Salt makes each hash unique even for identical passwords

**2. Session vs JWT authentication?**
| Aspect | Session | JWT |
|--------|---------|-----|
| Storage | Server | Client |
| Revocation | Instant | Requires blacklist |
| Scalability | Needs shared storage | Stateless |
| Security | Token never exposed | Token in browser |

**3. Why use UUIDs instead of auto-increment IDs?**
- Non-predictable (can't guess next ID)
- Globally unique (safe for distributed systems)
- No enumeration attacks (`/user/1`, `/user/2`, ...)

**4. What is a foreign key constraint?**
- Ensures referential integrity
- `userSessions.userId` must reference valid `users.id`
- Prevents orphaned sessions (sessions without users)
- Database enforces relationship

**5. Why separate database connection file?**
- Singleton pattern (one connection, many importers)
- Easier to mock for testing
- Configuration centralized
- Prevents connection pool exhaustion

---

## 🛠️ Debugging Tips

### View Database Contents
```bash
npm run db:studio
```
Opens visual database browser. Check if:
- Users are being created
- Passwords are hashed (not plain text)
- Sessions are being inserted
- Foreign key relationships are correct

### Check Docker Logs
```bash
docker-compose logs -f
```
Shows PostgreSQL logs. Look for:
- Connection errors
- Query syntax errors
- Permission issues

### Test Individual Routes
Use **Postman** or **Thunder Client** (VS Code extension) instead of curl:
- Easier to manage headers
- Save requests for reuse
- View formatted JSON responses

### Verify Environment Variables
```bash
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```
Ensures `.env` file is being read correctly.

---

## 📖 Additional Resources

### Documentation
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Node.js Crypto Module](https://nodejs.org/api/crypto.html)

### Concepts
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Understanding Salted Password Hashing](https://crackstation.net/hashing-security.htm)
- [Session Management Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

## 👨‍💻 Contributing

This is a learning project. To improve it:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/logout-endpoint`
3. Make changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add logout endpoint"`
5. Push and create pull request

---

## 📝 License

This project is for educational purposes. Feel free to use, modify, and learn from it.

---

## 🙋 Questions?

If something is unclear, check:
1. This README thoroughly
2. Code comments in source files
3. Database schema in `db/schema.js`
4. Drizzle Studio (`npm run db:studio`)

**Happy learning! 🚀**
