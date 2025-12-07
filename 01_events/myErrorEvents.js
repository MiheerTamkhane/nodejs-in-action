const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// Register an event listener for 'errorEvent'
eventEmitter.on('errorEvent', (error) => {
    console.error(`Error occurred: ${error.message}`);
});

// Emit the 'errorEvent' with an Error object
eventEmitter.emit('errorEvent', new Error('Something went wrong!'));