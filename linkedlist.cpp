#include <iostream>
using namespace std;

struct Node {
    int data;
    Node *next;

    Node(int value) {
        data = value;
        next = nullptr;
    }
};

class LinkedList{
private:
    Node *head;

public:
    LinkedList() {
        head = nullptr;
    }

    ~LinkedList() {
        // Free every node so the program ends with no leaks
        Node *current = head;
        while (current != nullptr) {
            Node *temp = current;
            current = current->next;
            delete temp;
        }
        head = nullptr;
    }

    bool isEmpty() {
        return head == nullptr;
    }

    void insertAtHead(int value) {
        Node *newNode = new Node(value);
        newNode->next = head;
        head = newNode;
        cout << "Inserted " << value << " at head\n";
    }

    void insertAtTail(int value) {
        Node *newNode = new Node(value);

        if (head == nullptr) {
            head = newNode;
            cout << "Inserted " << value << " at tail\n";
            return;
        }

        Node *current = head;
        while (current->next != nullptr) { // Walk to the last node
            current = current->next;
        }
        current->next = newNode;
        cout << "Inserted " << value << " at tail\n";
    }

    void deleteAtHead() {
        if (isEmpty()) {
            cout << "List Underflow! List is empty.\n";
            return;
        }
        Node *temp = head;
        head = head->next;
        cout << "Deleted " << temp->data << " from head\n";
        delete temp;
    }

    void deleteValue(int value) {
        if (isEmpty()) {
            cout << "List Underflow! List is empty.\n";
            return;
        }

        if (head->data == value) {
            deleteAtHead();
            return;
        }

        Node *current = head;
        while (current->next != nullptr) {
            if (current->next->data == value) {
                Node *temp = current->next;
                current->next = temp->next; // Unlink the node
                cout << "Deleted " << value << " from list\n";
                delete temp;
                return;
            }
            current = current->next;
        }

        cout << "Value " << value << " not found in the list\n";
    }

    void search(int value) {
        Node *current = head;
        int position = 0;
        while (current != nullptr) {
            if (current->data == value) {
                cout << "Found " << value << " at position " << position << "\n";
                return;
            }
            current = current->next;
            position++;
        }
        cout << "Value " << value << " not found in the list\n";
    }

    void display() {
        if (isEmpty()) {
            cout << "List is empty (head = nullptr).\n";
            return;
        }
        cout << "List elements (Head -> Tail): ";
        Node *current = head;
        while (current != nullptr) {
            cout << current->data << " ";
            current = current->next;
        }
        cout << "-> nullptr\n";
    }
};

int main() {
    LinkedList list;

    // Insert at tail
    list.insertAtTail(10);
    list.insertAtTail(20);

    // Insert at head
    list.insertAtHead(5);
    list.display();

    // Search operations
    list.search(10);
    list.search(99);

    // Delete operations
    list.deleteValue(20);
    list.deleteAtHead();
    list.display();

    return 0;
}
