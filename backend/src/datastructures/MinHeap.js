class MinHeap {
    constructor(compareFn) {
        this.heap = [];
        // compareFn(a, b) should return true if 'a' has higher priority than 'b' (i.e. 'a' should be closer to root)
        this.compareFn = compareFn || ((a, b) => a < b);
    }

    getParentIndex(index) { return Math.floor((index - 1) / 2); }
    getLeftChildIndex(index) { return 2 * index + 1; }
    getRightChildIndex(index) { return 2 * index + 2; }

    swap(index1, index2) {
        const temp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = temp;
    }

    insert(element) {
        this.heap.push(element);
        this.heapifyUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.isEmpty()) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.heap[0];
    }

    heapifyUp(index) {
        let currentIndex = index;
        let parentIndex = this.getParentIndex(currentIndex);

        while (currentIndex > 0 && this.compareFn(this.heap[currentIndex], this.heap[parentIndex])) {
            this.swap(currentIndex, parentIndex);
            currentIndex = parentIndex;
            parentIndex = this.getParentIndex(currentIndex);
        }
    }

    heapifyDown(index) {
        let currentIndex = index;
        let leftChildIndex = this.getLeftChildIndex(currentIndex);
        let rightChildIndex = this.getRightChildIndex(currentIndex);
        let smallestOrLargest = currentIndex;

        if (leftChildIndex < this.heap.length && this.compareFn(this.heap[leftChildIndex], this.heap[smallestOrLargest])) {
            smallestOrLargest = leftChildIndex;
        }

        if (rightChildIndex < this.heap.length && this.compareFn(this.heap[rightChildIndex], this.heap[smallestOrLargest])) {
            smallestOrLargest = rightChildIndex;
        }

        if (smallestOrLargest !== currentIndex) {
            this.swap(currentIndex, smallestOrLargest);
            this.heapifyDown(smallestOrLargest);
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    size() {
        return this.heap.length;
    }

    toArray() {
        return [...this.heap];
    }
}

module.exports = MinHeap;
