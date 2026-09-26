#include <iostream>
using namespace std;

#define MAX_SIZE 5

class LinearQueue{
private:
    int arr[MAX_SIZE];
    int front;
    int rear;

public:
    LinearQueue() {
        front = -1;
        rear = -1;
    }

    bool isFull() {
        return rear == MAX_SIZE - 1;
    }

    bool isEmpty() {
        return front == -1 || front > rear;
    }

    void enqueue(int value) {
        if (isFull()) {
            cout << "Queue Overflow! Cannot enqueue " << value << "\n";
            return;
        }
        if (front == -1) {
            front = 0; // Initialize front on first insertion
        }
        arr[++rear] = value;
        cout << "Enqueued: " << value << "\n";
    }

    void dequeue() {
        if (isEmpty()) {
            cout << "Queue Underflow! Queue is empty.\n";
            return;
        }
        cout << "Dequeued: " << arr[front++] << "\n";

        // Reset indices once all elements are removed
        if (front > rear) {
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
        for (int i = front; i <= rear; i++) {
            cout << arr[i] << " ";
        }
        cout << "\n";
    }
};

int main() {
    LinearQueue q;

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
