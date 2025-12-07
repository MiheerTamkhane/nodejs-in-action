const ChatRoom = require('./chatRoom.js');

const chat = new ChatRoom('General');

chat.on('userJoined', (user) => {
    console.log(`${user} has joined the chat.`);
});

chat.on('userLeft', (user) => {
    console.log(`${user} has left the chat.`);
});

chat.on('message', ({ user, message }) => {
    console.log(`${user}: ${message}`);
});

// Simulating chat room activity
chat.join('Alice');
chat.join('Bob');

chat.sendMessage('Alice', 'Hello everyone!');
chat.sendMessage('Bob', 'Hi Alice!');

chat.leave('Alice');
chat.sendMessage('Alice', 'I am still here?'); // This will throw an error
chat.sendMessage('Bob', 'Goodbye Alice!');
chat.leave('Bob');