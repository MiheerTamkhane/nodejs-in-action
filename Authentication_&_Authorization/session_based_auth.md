# Building Your First Authentication System: A Practical Guide

Let's explore how authentication works in web applications. We'll walk through the key concepts, implementation steps, and code structure you need to build a secure authentication system.

## What is Authentication?

Authentication verifies who a user is, allowing secure access to your application. In this guide, we'll build a complete authentication system, starting with user registration.

## Step 1: Setting Up API Endpoints

First, let's define the API endpoints for user authentication. You'll need three essential endpoints:

- **Registration:** For creating a new user account.
- **Login:** To authenticate returning users.
- **Logout:** For user session termination.

*Example API Endpoints:*
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/logout`

## Step 2: Receiving User Data

Your API can receive data from different sources - the request body, headers, or URL parameters. 

### Working with Request Body

Most user data comes from the request body. Here's how to extract user information:

```javascript
const { username, email, password } = req.body;```

## Step 3: Validating User Input

Before processing user data, always validate it. Check if all required fields are present and in the correct format.

```javascript
// Basic validation
if (!username || !email || !password) {
  return res.status(400).json({ 
    error: "Please provide all required fields" 
  });
}

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ 
    error: "Please provide a valid email" 
  });
}

// Password strength check
if (password.length < 6) {
  return res.status(400).json({ 
    error: "Password must be at least 6 characters long" 
  });
}
```

## Step 4: Checking if User Already Exists

Before creating a new user, check if the username or email is already registered in your database.

```javascript
// Check if user exists
const existingUser = await User.findOne({ 
  $or: [{ email }, { username }] 
});

if (existingUser) {
  return res.status(409).json({ 
    error: "User with this email or username already exists" 
  });
}
```

## Step 5: Hashing Passwords

Never store passwords in plain text! Use a library like `bcrypt` to hash passwords before saving them.

```javascript
const bcrypt = require('bcrypt');

// Hash the password
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

**Why hash passwords?**
- If your database is compromised, hackers can't read the actual passwords
- Each password gets a unique "salt" making it harder to crack
- Hashing is a one-way process - you can't reverse it

## Step 6: Creating the User in Database

Now save the user with the hashed password to your database.

```javascript
const newUser = new User({
  username,
  email,
  password: hashedPassword,
  createdAt: new Date()
});

await newUser.save();
```

## Step 7: Generating JWT Tokens

After successful registration or login, generate a JSON Web Token (JWT) for the user. This token will be used to authenticate future requests.

```javascript
const jwt = require('jsonwebtoken');

// Generate token
const token = jwt.sign(
  { 
    userId: newUser._id, 
    email: newUser.email 
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

**What is JWT?**
- JWT (JSON Web Token) is a secure way to transmit information between parties
- It contains three parts: Header, Payload, and Signature
- The token is signed with a secret key, making it tamper-proof

## Step 8: Sending Response with Token

Send the token back to the client along with user information.

```javascript
res.status(201).json({
  message: "User registered successfully",
  token,
  user: {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email
  }
});
```

## Complete Registration Code Example

Here's how all the steps come together:

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    // Step 1: Extract data
    const { username, email, password } = req.body;

    // Step 2: Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: "Please provide all required fields" 
      });
    }

    // Step 3: Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: "User already exists" 
      });
    }

    // Step 4: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5: Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Step 6: Generate token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Step 7: Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: "Server error during registration" 
    });
  }
};
```

## Building the Login Functionality

Login is similar to registration, but instead of creating a user, we verify their credentials.

### Step 1: Extract Login Credentials

```javascript
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Please provide email and password" 
      });
    }
```

### Step 2: Find User in Database

```javascript
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }
```

### Step 3: Compare Passwords

Use bcrypt to compare the provided password with the hashed password in the database.

```javascript
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }
```

**Security Tip:** Always return the same error message for both "user not found" and "wrong password" to prevent attackers from figuring out which emails are registered.

### Step 4: Generate Token and Send Response

```javascript
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: "Server error during login" 
    });
  }
};
```

## Protecting Routes with Middleware

Now that users can register and login, let's create middleware to protect routes that require authentication.

### Creating Auth Middleware

```javascript
const jwt = require('jsonwebtoken');

exports.authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        error: "Access denied. No token provided." 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: "Token has expired" 
      });
    }
    res.status(401).json({ 
      error: "Invalid token" 
    });
  }
};
```

### Using the Middleware

```javascript
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Public route
router.get('/public', (req, res) => {
  res.json({ message: "This is public" });
});

// Protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ 
    message: "This is protected",
    userId: req.userId 
  });
});

module.exports = router;
```

## Implementing Logout

Logout in JWT-based authentication is handled on the client side by deleting the token.

```javascript
exports.logout = (req, res) => {
  // In JWT auth, logout is typically handled client-side
  // by removing the token from storage
  res.status(200).json({ 
    message: "Logout successful. Please remove token from client." 
  });
};
```

**Client-side logout:**
```javascript
// Remove token from localStorage
localStorage.removeItem('token');

// Or from sessionStorage
sessionStorage.removeItem('token');
```

## User Model Example

Here's a complete User model using MongoDB/Mongoose:

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

module.exports = mongoose.model('User', userSchema);
```

## Environment Variables Setup

Create a `.env` file to store sensitive information:

```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth-demo
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

**Security Best Practices:**
- Never commit your `.env` file to Git
- Use strong, random JWT secrets in production
- Keep your secrets long and complex
- Rotate secrets periodically

## Complete Server Setup

Here's a complete Express server setup:

```javascript
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Testing Your Authentication System

### Using Postman or cURL

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Access protected route:**
```bash
curl -X GET http://localhost:5000/api/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Security Issues to Avoid

1. **Storing passwords in plain text** - Always hash passwords
2. **Using weak JWT secrets** - Use long, random strings
3. **Not validating input** - Always validate and sanitize user input
4. **Exposing sensitive information** - Don't send password hashes in responses
5. **Not setting token expiration** - Always set reasonable expiration times
6. **Storing tokens in localStorage** - Consider using httpOnly cookies for better security
7. **Not handling errors properly** - Don't expose internal errors to users

## Additional Features You Can Add

### Password Reset
- Generate a temporary reset token
- Send email with reset link
- Verify token and allow password change

### Email Verification
- Send verification email on registration
- User must verify before full access

### Refresh Tokens
- Issue short-lived access tokens
- Use refresh tokens to get new access tokens
- Better security and user experience

### Rate Limiting
- Prevent brute force attacks
- Limit login attempts per IP
- Use libraries like `express-rate-limit`

### Two-Factor Authentication (2FA)
- Add extra security layer
- Use TOTP (Time-based One-Time Password)
- Libraries: `speakeasy`, `qrcode`

## Wrapping Up

You now have a complete understanding of how to build an authentication system from scratch! Here's what we covered:

1. Setting up API endpoints
2. Validating and processing user input
3. Hashing passwords securely
4. Generating and verifying JWT tokens
5. Protecting routes with middleware
6. Best practices for security

Remember, authentication is critical for your application's security. Always keep your dependencies updated, follow security best practices, and never stop learning about new security threats.

Happy coding, and stay secure! 🔒
