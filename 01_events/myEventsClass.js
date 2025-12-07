const EventEmitter = require('events');

class Chat extends EventEmitter {

    setMessage(message) {
        console.log(`Setting message: ${message}`);
        this.message = message;
        this.emit('messageSent', message);
    }
}

const chat = new Chat();

// Register an event listener for 'messageSent' event
chat.on('messageSent', (message) => {
    console.log(`Message sent: ${message}`);
});

// Set a message which will emit the 'messageSent' event
chat.setMessage('Hello, this is a chat message!');