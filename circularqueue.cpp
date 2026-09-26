#include <iostream>
using namespace std;

#define MAX_SIZE 5

class CircularQueue{
private:
    int arr[MAX_SIZE];
    int front;
    int rear;

public:
    CircularQueue() {
        front = -1;
        rear = -1;
    }

    bool isFull() {
        return (rear + 1) % MAX_SIZE == front;
    }

    bool isEmpty() {
        return front == -1;
    }

    void enqueue(int value) {
        if (isFull()) {
            cout << "Queue Overflow! Cannot enqueue " << value << "\n";
            return;
        }
        if (isEmpty()) {
            front = 0; // Initialize front on first insertion
        }
        rear = (rear + 1) % MAX_SIZE; // Wrap around to the start
        arr[rear] = value;
        cout << "Enqueued: " << value << " at index " << rear << "\n";
    }

    void dequeue() {
        if (isEmpty()) {
            cout << "Queue Underflow! Queue is empty.\n";
            return;
        }
        cout << "Dequeued: " << arr[front] << " from index " << front << "\n";
        front = (front + 1) % MAX_SIZE; // Wrap around to the end

        // Reset indices once all elements are removed
        if (front == (rear + 1) % MAX_SIZE) {
            front = -1;
            rear = -1;
        }
    }

    int peek() {
        if (isEmpty()) {
            cout << "Queue is empty.\n";
            return -1;
        }
        return arr[front];
    }

    void display() {
        if (isEmpty()) {
            cout << "Queue is empty.\n";
            return;
        }
        cout << "Queue elements (Front -> Rear): ";
        int i = front;
        while (true) {
            cout << arr[i] << " ";
            if (i == rear) {
                break;
            }
            i = (i + 1) % MAX_SIZE; // Walk the ring
        }
        cout << "\n";
    }
};

int main() {
    CircularQueue q;

    // Enqueue operations
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);
    q.display();

    // Peek operation
    cout << "Front element: " << q.peek() << "\n";

    // Dequeue operations
    q.dequeue();
    q.display();

    return 0;
}
