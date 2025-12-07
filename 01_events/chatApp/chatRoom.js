const EventEmitter = require('events');

class ChatRoom extends EventEmitter {
    constructor(roomName) {
        super();
        this.roomName = roomName;
        this.users = new Set();
    }

    join(user) {
        this.users.add(user);
        this.emit('userJoined', user);
    }

    leave(user) {
        if (this.users.has(user)) {
            this.users.delete(user);
            this.emit('userLeft', user);
        }
    }

    sendMessage(user, message) {
        if (this.users.has(user)) {
            this.emit('message', { user, message });
        } else {
           console.error(`${user} is not in the chat room.`);
        }
    }
}

module.exports = ChatRoom;