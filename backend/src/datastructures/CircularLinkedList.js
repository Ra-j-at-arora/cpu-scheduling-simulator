class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class CircularLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    enqueue(element) {
        const newNode = new Node(element);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            newNode.next = this.head;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
            this.tail.next = this.head;
        }
        this.length++;
    }

    dequeue() {
        if (!this.head) return null;

        const data = this.head.data;
        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            this.head = this.head.next;
            this.tail.next = this.head;
        }
        this.length--;
        return data;
    }

    // Moves the head to the next node (simulates context switch rotation without removing)
    rotate() {
        if (this.head && this.head !== this.tail) {
            this.tail = this.head;
            this.head = this.head.next;
        }
    }

    isEmpty() {
        return this.length === 0;
    }

    size() {
        return this.length;
    }

    toArray() {
        const result = [];
        if (!this.head) return result;
        
        let current = this.head;
        do {
            result.push(current.data);
            current = current.next;
        } while (current !== this.head);
        
        return result;
    }
}

module.exports = CircularLinkedList;
