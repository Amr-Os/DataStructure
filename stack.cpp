#include <iostream>
using namespace std;

#define MAX_SIZE 5

class Stack {
private:
    int arr[MAX_SIZE];
    int top;

public:
    Stack() {
        top = -1;
    }

    bool isFull() {
        return top == MAX_SIZE - 1;
    }

    bool isEmpty() {
        return top == -1;
    }

    void push(int value) {
        if (isFull()) {
            cout << "Stack Overflow! Cannot push " << value << "\n";
            return;
        }
        arr[++top] = value;
        cout << "Pushed: " << value << "\n";
    }

    void pop() {
        if (isEmpty()) {
            cout << "Stack Underflow! Stack is empty.\n";
            return;
        }
        cout << "Popped: " << arr[top] << "\n";
        top--;
    }

    int peek() {
        if (isEmpty()) {
            cout << "Stack is empty.\n";
            return -1;
        }
        return arr[top];
    }

    void display() {
        if (isEmpty()) {
            cout << "Stack is empty.\n";
            return;
        }
        cout << "Stack elements (Top -> Bottom): ";
        for (int i = top; i >= 0; i--) {
            cout << arr[i] << " ";
        }
        cout << "\n";
    }
};

int main() {
    Stack s;

    // Push operations
    s.push(10);
    s.push(20);
    s.push(30);
    s.display();

    // Peek operation
    cout << "Top element: " << s.peek() << "\n";

    // Pop operation
    s.pop();
    s.display();

    return 0;
}
