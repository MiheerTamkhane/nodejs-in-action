const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

// Register an event listener for 'greet' event
eventEmitter.on('greet', (name) => {
    console.log(`Hello, ${name}!`);
});

eventEmitter.once('notify', (message) => {
    console.log(`Notification: ${message}`);
});

// Emit the 'greet' event
eventEmitter.emit('greet', 'Miheer');

// Emit the 'notify' event twice
eventEmitter.emit('notify', 'You have a new message.');
eventEmitter.emit('notify', 'This will not be logged.');


// Register a listener for 'dataEvent'
const myListener = (data) => {
    console.log(`Data received: ${data}`);
}
eventEmitter.on('dataEvent', myListener);

// Emit the 'dataEvent'
eventEmitter.emit('dataEvent', 'Sample data');

// Remove the listener for 'dataEvent'
eventEmitter.removeListener('dataEvent', myListener);

// Emit the 'dataEvent' again to show that the listener has been removed
eventEmitter.emit('dataEvent', 'This will not be logged.');

