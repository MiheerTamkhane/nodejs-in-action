# Events & Event-Driven Architecture in Node.js 🎭

A comprehensive guide to understanding and implementing event-driven programming in Node.js, from basic concepts to building a real-time chat application.

---

## 📖 Table of Contents

1. [What Are Events?](#-what-are-events)
2. [Why Events Matter in Node.js](#-why-events-matter-in-nodejs)
3. [Learning Path](#-learning-path)
4. [File Structure & Execution Order](#-file-structure--execution-order)
5. [Core Concepts Explained](#-core-concepts-explained)
6. [File-by-File Documentation](#-file-by-file-documentation)
7. [Chat Application Deep Dive](#-chat-application-deep-dive)
8. [Running the Examples](#-running-the-examples)
9. [Key Takeaways](#-key-takeaways)

---

## 🎯 What Are Events?

**Events** are actions or occurrences that happen in your application. Think of them like notifications that say "something just happened."

### Real-World Analogy
Imagine a doorbell:
- **Event**: Someone presses the doorbell button
- **Event Listener**: Your ears waiting to hear the ring
- **Event Handler**: You walking to the door to open it

In programming:
- **Event**: User clicks a button, file finishes reading, server receives a request
- **Event Listener**: Code waiting for that specific event
- **Event Handler**: Function that executes when the event occurs

---

## 🤔 Why Events Matter in Node.js

Node.js is built on an **event-driven architecture**. Understanding events is crucial because:

### 1. **Asynchronous Nature**
Node.js handles operations without blocking code execution. Events notify you when operations complete.

```
Traditional Blocking:
Step 1 → Wait → Step 2 → Wait → Step 3 (slow)

Event-Driven Non-Blocking:
Step 1 (trigger) → Step 2 (trigger) → Step 3 (trigger)
   ↓                  ↓                  ↓
Listen for completion events (fast)
```

### 2. **Decoupling Code**
Events separate "what happened" from "what to do about it." Multiple listeners can respond to the same event without knowing about each other.

### 3. **Real-Time Applications**
Events enable real-time features like chat apps, live notifications, and streaming data.

### 4. **Core Node.js Pattern**
Most Node.js modules use events: HTTP servers emit 'request' events, streams emit 'data' events, etc.

---

## 🎓 Learning Path

This folder teaches events in a progressive manner:

```
1. Basic Events (myEvents.js)
   ↓
2. Custom Event Classes (myEventsClass.js)
   ↓
3. Error Handling (myErrorEvents.js)
   ↓
4. Real-World Application (chatApp/)
```

Each step builds on the previous, ensuring you understand concepts before moving forward.

---

## 📁 File Structure & Execution Order

```
01_events/
├── myEvents.js           # START HERE: Basic EventEmitter usage
├── myEventsClass.js      # NEXT: Creating custom event classes
├── myErrorEvents.js      # THEN: Handling errors with events
├── chatApp/
│   ├── chatRoom.js       # STUDY: ChatRoom class definition
│   └── index.js          # RUN: Complete chat application
└── README.md             # This file
```

### Why This Order?

1. **myEvents.js**: Learn the building blocks (on, once, emit, removeListener)
2. **myEventsClass.js**: Understand how to extend EventEmitter for custom behavior
3. **myErrorEvents.js**: Learn crucial error handling patterns
4. **chatApp/**: Apply everything in a realistic scenario

---

## 💡 Core Concepts Explained

### The EventEmitter Class

Node.js provides the `EventEmitter` class in the `events` module. This is the foundation of all event-driven code in Node.js.

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();
```

### Four Essential Methods

#### 1. **on(eventName, callback)** - Register a Listener
Listens for an event and executes the callback every time the event is emitted.

```javascript
emitter.on('greet', (name) => {
    console.log(`Hello, ${name}!`);
});
```

**When to use**: When you want to respond to an event multiple times.

#### 2. **once(eventName, callback)** - One-Time Listener
Listens for an event but only executes once, then automatically removes itself.

```javascript
emitter.once('notify', (message) => {
    console.log(message);
});
```

**When to use**: For one-time initialization, login events, or first-time user actions.

#### 3. **emit(eventName, ...args)** - Trigger an Event
Fires an event, calling all registered listeners with the provided arguments.

```javascript
emitter.emit('greet', 'Alice');  // Triggers the 'greet' listeners
```

**When to use**: Whenever you want to notify that something has happened.

#### 4. **removeListener(eventName, callback)** - Unregister a Listener
Stops listening to an event by removing a specific callback.

```javascript
emitter.removeListener('dataEvent', myListener);
```

**When to use**: To prevent memory leaks, clean up resources, or stop unnecessary processing.

---

## 📄 File-by-File Documentation

### 📘 myEvents.js

**Purpose**: Introduce the four core EventEmitter methods with practical examples.

**What It Does**:
- Creates an EventEmitter instance
- Demonstrates `on()` for repeated event handling
- Shows `once()` for single-execution events
- Illustrates `removeListener()` for cleanup

**Why It Exists**: This is your starting point. Before building complex systems, you must understand these fundamental operations.

**Key Learning Points**:

```javascript
// 1. Basic Listener (fires every time)
eventEmitter.on('greet', (name) => {
    console.log(`Hello, ${name}!`);
});
eventEmitter.emit('greet', 'Miheer');  // Output: Hello, Miheer!
```

**Pattern**: Register listener → Emit event → Callback executes

```javascript
// 2. One-Time Listener (fires once, then removes itself)
eventEmitter.once('notify', (message) => {
    console.log(`Notification: ${message}`);
});
eventEmitter.emit('notify', 'You have a new message.');  // Logs message
eventEmitter.emit('notify', 'This will not be logged.');  // Nothing happens
```

**Pattern**: Use `once()` when you only want to respond to the first occurrence.

```javascript
// 3. Removing Listeners (cleanup)
const myListener = (data) => {
    console.log(`Data received: ${data}`);
}
eventEmitter.on('dataEvent', myListener);
eventEmitter.emit('dataEvent', 'Sample data');  // Logs data

eventEmitter.removeListener('dataEvent', myListener);
eventEmitter.emit('dataEvent', 'This will not be logged.');  // Nothing happens
```

**Pattern**: Store reference to listener → Remove when no longer needed → Prevent memory leaks

**When to Run**: Run this file first to see basic event mechanics in action.

```bash
node myEvents.js
```

---

### 📗 myEventsClass.js

**Purpose**: Teach how to create custom classes that emit events by extending EventEmitter.

**What It Does**:
- Defines a `Chat` class that extends `EventEmitter`
- Implements a method that emits events
- Shows how to encapsulate event logic within classes

**Why It Exists**: Most real-world applications don't use raw EventEmitter. They create custom classes with specific behaviors. This pattern is used throughout Node.js and professional codebases.

**Architectural Pattern**: Class-based event emitters allow you to:
- Encapsulate state and behavior
- Emit events as part of business logic
- Create reusable, testable components

**Code Breakdown**:

```javascript
const EventEmitter = require('events');

class Chat extends EventEmitter {
    setMessage(message) {
        console.log(`Setting message: ${message}`);
        this.message = message;                    // Store state
        this.emit('messageSent', message);         // Notify listeners
    }
}
```

**How It Works**:
1. `Chat` extends `EventEmitter`, inheriting all event methods
2. `setMessage()` encapsulates the logic: store message + emit event
3. External code can listen to `messageSent` without knowing internal details

**Usage Pattern**:

```javascript
const chat = new Chat();

// Register listener before triggering actions
chat.on('messageSent', (message) => {
    console.log(`Message sent: ${message}`);
});

// Trigger action (which emits event internally)
chat.setMessage('Hello, this is a chat message!');
```

**Mental Model**:
```
Class Method Called → Internal State Changes → Event Emitted → Listeners Notified
```

**Why This Matters**: This is how you build scalable applications. The `Chat` class doesn't care who's listening—it just announces when something happens. Listeners can be added or removed without changing the class.

**When to Run**:

```bash
node myEventsClass.js
```

**Expected Output**:
```
Setting message: Hello, this is a chat message!
Message sent: Hello, this is a chat message!
```

---

### 📙 myErrorEvents.js

**Purpose**: Demonstrate proper error handling in event-driven code.

**What It Does**:
- Shows how to emit error events
- Illustrates the pattern for error handling with EventEmitter

**Why It Exists**: Errors in Node.js applications can crash your entire server if not handled properly. Event-driven error handling is a standard pattern you must understand.

**Critical Concept**: In Node.js, unhandled errors in EventEmitter can crash your application. Always listen for 'error' events.

**Code Breakdown**:

```javascript
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// Always register error listeners BEFORE emitting errors
eventEmitter.on('errorEvent', (error) => {
    console.error(`Error occurred: ${error.message}`);
});

// Emit errors as Error objects (best practice)
eventEmitter.emit('errorEvent', new Error('Something went wrong!'));
```

**Best Practices**:

1. **Always Use Error Objects**: Pass `new Error()` instead of strings for better stack traces
2. **Register Error Listeners First**: Before any operations that might fail
3. **Graceful Degradation**: Log errors, notify users, but keep app running
4. **Special 'error' Event**: EventEmitter treats 'error' events specially—if no listener exists, Node.js crashes

**When to Run**:

```bash
node myErrorEvents.js
```

**Expected Output**:
```
Error occurred: Something went wrong!
```

**What Breaks Without Error Handling**: If you emit an 'error' event without a listener:
```javascript
emitter.emit('error', new Error('Crash!'));  // CRASHES THE APPLICATION
```

---

## 🏗️ Chat Application Deep Dive

The `chatApp/` folder contains a complete, production-ready example demonstrating all event concepts in a real-world scenario.

### Architecture Overview

```
┌─────────────┐
│  index.js   │  (Application Entry Point)
│             │  - Creates ChatRoom instance
│             │  - Registers event listeners
│             │  - Simulates user activity
└─────────────┘
       │
       │ imports
       ↓
┌─────────────┐
│ chatRoom.js │  (ChatRoom Class)
│             │  - Extends EventEmitter
│             │  - Manages users (Set)
│             │  - Emits: userJoined, userLeft, message
│             │  - Methods: join(), leave(), sendMessage()
└─────────────┘
```

---

### 📄 chatApp/chatRoom.js

**Purpose**: Define a ChatRoom class that manages users and messages using events.

**What It Does**:
- Extends EventEmitter to create a custom event-driven class
- Manages a set of users in the chat room
- Emits events when users join, leave, or send messages
- Validates user presence before allowing messages

**Why It Exists**: This demonstrates **separation of concerns**. The ChatRoom class handles business logic (user management) and emits events. The consumer (index.js) handles presentation logic (displaying messages).

**Complete Code Analysis**:

```javascript
const EventEmitter = require('events');

class ChatRoom extends EventEmitter {
    constructor(roomName) {
        super();                          // Initialize EventEmitter
        this.roomName = roomName;        // Room identifier
        this.users = new Set();          // Set ensures unique users
    }
```

**Why Set?**: A `Set` automatically prevents duplicate users and provides fast lookup with `.has()`.

```javascript
    join(user) {
        this.users.add(user);            // Add user to room
        this.emit('userJoined', user);   // Notify listeners
    }
```

**Pattern**: Modify state → Emit event → Let listeners decide what to do

```javascript
    leave(user) {
        if (this.users.has(user)) {
            this.users.delete(user);
            this.emit('userLeft', user);
        }
    }
```

**Defensive Programming**: Check if user exists before removing. Silent failure if user not in room.

```javascript
    sendMessage(user, message) {
        if (this.users.has(user)) {
            this.emit('message', { user, message });  // Emit with object payload
        } else {
            console.error(`${user} is not in the chat room.`);
        }
    }
}

module.exports = ChatRoom;
```

**Validation**: Users must be in the room to send messages. This prevents bugs and ensures data integrity.

**Events Emitted**:

1. **userJoined** (user: string)
   - When: User successfully joins
   - Payload: Username
   - Use Case: Display "X joined the chat" notifications

2. **userLeft** (user: string)
   - When: User successfully leaves
   - Payload: Username
   - Use Case: Display "X left the chat" notifications

3. **message** ({user, message})
   - When: Valid user sends a message
   - Payload: Object with user and message
   - Use Case: Display chat messages with sender name

**Design Philosophy**:
- **Single Responsibility**: ChatRoom manages users, not UI
- **Event-Driven**: No tight coupling between logic and presentation
- **Extensible**: Easy to add more event types (typing indicators, reactions, etc.)

---

### 📄 chatApp/index.js

**Purpose**: Application entry point that uses ChatRoom and responds to events.

**What It Does**:
- Creates a ChatRoom instance
- Registers listeners for all events
- Simulates user interactions
- Demonstrates error handling (user not in room)

**Why It Exists**: Shows how to consume an event-driven class and handle events in application code.

**Complete Code Analysis**:

```javascript
const ChatRoom = require('./chatRoom.js');

const chat = new ChatRoom('General');
```

**Initialization**: Create a chat room named "General". The name could be used to identify multiple rooms.

```javascript
// Listener 1: Handle users joining
chat.on('userJoined', (user) => {
    console.log(`${user} has joined the chat.`);
});

// Listener 2: Handle users leaving
chat.on('userLeft', (user) => {
    console.log(`${user} has left the chat.`);
});

// Listener 3: Handle messages
chat.on('message', ({ user, message }) => {
    console.log(`${user}: ${message}`);
});
```

**Best Practice**: Register all listeners before triggering any events. This ensures no events are missed.

**Event Flow Simulation**:

```javascript
// Step 1: Alice joins
chat.join('Alice');  
// → Emits 'userJoined' 
// → Listener prints: "Alice has joined the chat."

// Step 2: Bob joins
chat.join('Bob');
// → Emits 'userJoined'
// → Listener prints: "Bob has joined the chat."

// Step 3: Alice sends message
chat.sendMessage('Alice', 'Hello everyone!');
// → Validates Alice is in room ✓
// → Emits 'message' with {user: 'Alice', message: 'Hello everyone!'}
// → Listener prints: "Alice: Hello everyone!"

// Step 4: Bob responds
chat.sendMessage('Bob', 'Hi Alice!');
// → Validates Bob is in room ✓
// → Emits 'message'
// → Listener prints: "Bob: Hi Alice!"

// Step 5: Alice leaves
chat.leave('Alice');
// → Removes Alice from users Set
// → Emits 'userLeft'
// → Listener prints: "Alice has left the chat."

// Step 6: Alice tries to send message (ERROR CASE)
chat.sendMessage('Alice', 'I am still here?');
// → Validates Alice is in room ✗
// → Error: "Alice is not in the chat room."
// → No event emitted

// Step 7: Bob sends farewell
chat.sendMessage('Bob', 'Goodbye Alice!');
// → Works because Bob is still in room

// Step 8: Bob leaves
chat.leave('Bob');
// → Emits 'userLeft'
// → Listener prints: "Bob has left the chat."
```

**Execution Flow Diagram**:

```
join('Alice') → userJoined event → Console: "Alice has joined"
     ↓
join('Bob') → userJoined event → Console: "Bob has joined"
     ↓
sendMessage('Alice', 'Hello') → message event → Console: "Alice: Hello"
     ↓
sendMessage('Bob', 'Hi') → message event → Console: "Bob: Hi"
     ↓
leave('Alice') → userLeft event → Console: "Alice has left"
     ↓
sendMessage('Alice', '...') → ✗ No event → Error logged
     ↓
sendMessage('Bob', 'Goodbye') → message event → Console: "Bob: Goodbye"
     ↓
leave('Bob') → userLeft event → Console: "Bob has left"
```

**When to Run**:

```bash
cd chatApp
node index.js
```

**Expected Output**:
```
Alice has joined the chat.
Bob has joined the chat.
Alice: Hello everyone!
Bob: Hi Alice!
Alice has left the chat.
Alice is not in the chat room.
Bob: Goodbye Alice!
Bob has left the chat.
```

---

## 🚀 Running the Examples

### Prerequisites
- Node.js installed (v14 or higher)
- Terminal/Command line access
- Text editor (VS Code recommended)

### Step-by-Step Execution

```bash
# Navigate to the events folder
cd 01_events

# Step 1: Run basic events example
node myEvents.js

# Step 2: Run custom class example
node myEventsClass.js

# Step 3: Run error handling example
node myErrorEvents.js

# Step 4: Run complete chat application
cd chatApp
node index.js
```

### Experimentation Ideas

1. **myEvents.js**:
   - Add more event listeners to the same event
   - Try emitting events before registering listeners (observe no output)
   - Test `removeListener` with multiple listeners

2. **myEventsClass.js**:
   - Add more methods to the Chat class (e.g., `deleteMessage()`)
   - Create multiple Chat instances with different listeners
   - Store message history and emit when new message arrives

3. **chatApp**:
   - Add a typing indicator event
   - Implement private messages between users
   - Add room capacity limits
   - Track message timestamps
   - Implement message editing/deletion

---

## 🎯 Key Takeaways

### Fundamental Concepts

1. **Event-Driven Programming**: Actions trigger events, listeners respond asynchronously
2. **EventEmitter**: Core Node.js class for implementing events
3. **Decoupling**: Events separate "what happened" from "what to do"
4. **Asynchronous**: Events don't block execution

### Essential Patterns

1. **Register Before Emit**: Always add listeners before emitting events
2. **Extend for Custom Logic**: Create classes extending EventEmitter for domain-specific behavior
3. **Error Handling**: Always listen for error events to prevent crashes
4. **Cleanup**: Remove listeners when no longer needed to prevent memory leaks

### Real-World Applications

1. **Chat Systems**: User actions trigger events (join, leave, message)
2. **HTTP Servers**: Request events trigger response handling
3. **Streams**: Data events deliver chunks as they arrive
4. **Custom APIs**: Business logic emits events for state changes

### Memory Leak Prevention

```javascript
// ❌ BAD: Creates new listener every time
setInterval(() => {
    emitter.on('data', handler);  // Memory leak!
}, 1000);

// ✅ GOOD: Register once, or clean up
emitter.on('data', handler);

// Or remove when done
emitter.removeListener('data', handler);
```

---

## 📚 Next Steps

After mastering events, you'll understand:
- How Node.js HTTP servers work (they emit 'request' events)
- How streams process data (they emit 'data' and 'end' events)
- How to build real-time applications with WebSockets
- How to create modular, maintainable architectures

### Advanced Topics to Explore

1. **Event Emitter Methods**:
   - `removeAllListeners()`: Remove all listeners for an event
   - `listenerCount()`: Count listeners for an event
   - `eventNames()`: Get all event names with listeners

2. **Max Listeners Warning**:
   ```javascript
   emitter.setMaxListeners(20);  // Default is 10
   ```

3. **Error Event Special Behavior**:
   ```javascript
   // If no listener for 'error', Node.js crashes
   emitter.emit('error', new Error('Boom!'));  // Crashes
   
   // Solution: Always add error listener
   emitter.on('error', (err) => console.error(err));
   ```

4. **Async Event Handlers**:
   ```javascript
   emitter.on('data', async (data) => {
       await processData(data);  // Async operations in handlers
   });
   ```

---

## 🔗 Related Concepts in Node.js

- **Streams**: Built on EventEmitter, emit data/end/error events
- **HTTP Module**: Server emits 'request', 'connection', 'close' events
- **File System**: Watchers emit 'change' events
- **Child Processes**: Emit 'exit', 'error', 'message' events
- **Cluster Module**: Workers emit lifecycle events

---

## 📖 Additional Resources

- [Node.js Events Documentation](https://nodejs.org/api/events.html)
- [Understanding Event-Driven Architecture](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [EventEmitter Best Practices](https://nodejs.org/api/events.html#events_error_events)

---

## 🤝 Contributing

Found a bug or have a suggestion? Feel free to:
- Add more event examples
- Improve explanations
- Fix errors
- Add advanced use cases

---

**Happy Learning! 🎉**

Master events, and you've mastered the heart of Node.js.