// queue.js
class Queue {
    constructor() {
        this.queue = [];
    }

    enqueue(item) {
        this.queue.unshift(item);
    }

    dequeue() {
        if (this.isEmpty()) {
            throw new Error("dequeue from an empty queue");
        }
        return this.queue.pop();
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    peek() {
        if (this.isEmpty()) {
            throw new Error("peek from an empty queue");
        }
        return this.queue[this.queue.length - 1];
    }

    size() {
        return this.queue.length;
    }
}

// Export the Queue class
module.exports = Queue;
