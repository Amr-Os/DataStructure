#include <iostream>
using namespace std;

struct DNode {
    int data;
    DNode *prev;
    DNode *next;

    DNode(int value) {
        data = value;
        prev = nullptr;
        next = nullptr;
    }
};

class DoublyLinkedList{
private:
    DNode *head;
    DNode *tail;

public:
    DoublyLinkedList() {
        head = nullptr;
        tail = nullptr;
    }

    ~DoublyLinkedList() {
        // Free every node so the program ends with no leaks
        DNode *current = head;
        while (current != nullptr) {
            DNode *temp = current;
            current = current->next;
            delete temp;
        }
        head = nullptr;
        tail = nullptr;
    }

    bool isEmpty() {
        return head == nullptr;
    }

    void insertAtHead(int value) {
        DNode *newNode = new DNode(value);
        newNode->next = head;

        if (head != nullptr) {
            head->prev = newNode; // Old head points back to the new node
        } else {
            tail = newNode;
        }
        head = newNode;
        cout << "Inserted " << value << " at head\n";
    }

    void insertAtTail(int value) {
        DNode *newNode = new DNode(value);
        newNode->prev = tail;

        if (tail != nullptr) {
            tail->next = newNode; // Old tail points forward to the new node
        } else {
            head = newNode;
        }
        tail = newNode;
        cout << "Inserted " << value << " at tail\n";
    }

    void deleteAtHead() {
        if (isEmpty()) {
            cout << "List Underflow! List is empty.\n";
            return;
        }
        DNode *temp = head;
        head = head->next;
        cout << "Deleted " << temp->data << " from head\n";

        if (head != nullptr) {
            head->prev = nullptr; // Detach the new head
        } else {
            tail = nullptr;
        }
        delete temp;
    }

    void deleteAtTail() {
        if (isEmpty()) {
            cout << "List Underflow! List is empty.\n";
            return;
        }
        DNode *temp = tail;
        tail = tail->prev;
        cout << "Deleted " << temp->data << " from tail\n";

        if (tail != nullptr) {
            tail->next = nullptr; // Detach the new tail
        } else {
            head = nullptr;
        }
        delete temp;
    }

    void deleteValue(int value) {
        if (isEmpty()) {
            cout << "List Underflow! List is empty.\n";
            return;
        }

        DNode *current = head;
        while (current != nullptr) {
            if (current->data == value) {
                // Repair both links around the removed node
                if (current->prev != nullptr) {
                    current->prev->next = current->next;
                } else {
                    head = current->next;
                }

                if (current->next != nullptr) {
                    current->next->prev = current->prev;
                } else {
                    tail = current->prev;
                }

                cout << "Deleted " << value << " from list\n";
                delete current;
                return;
            }
            current = current->next;
        }

        cout << "Value " << value << " not found in the list\n";
    }

    void searchForward(int value) {
        DNode *current = head;
        int position = 0;
        while (current != nullptr) {
            if (current->data == value) {
                cout << "Found " << value << " at position " << position << " walking head to tail\n";
                return;
            }
            current = current->next;
            position++;
        }
        cout << "Value " << value << " not found in the list\n";
    }

    void searchBackward(int value) {
        DNode *current = tail;
        int position = 0;
        while (current != nullptr) {
            if (current->data == value) {
                cout << "Found " << value << " at position " << position << " walking tail to head\n";
                return;
            }
            current = current->prev;
            position++;
        }
        cout << "Value " << value << " not found in the list\n";
    }

    void displayForward() {
        if (isEmpty()) {
            cout << "List is empty (head = tail = nullptr).\n";
            return;
        }
        cout << "List elements (Head -> Tail): ";
        DNode *current = head;
        while (current != nullptr) {
            cout << current->data << " ";
            current = current->next;
        }
        cout << "-> nullptr\n";
    }

    void displayBackward() {
        if (isEmpty()) {
            cout << "List is empty (head = tail = nullptr).\n";
            return;
        }
        cout << "List elements (Tail -> Head): ";
        DNode *current = tail;
        while (current != nullptr) {
            cout << current->data << " ";
            current = current->prev;
        }
        cout << "-> nullptr\n";
    }
};

int main() {
    DoublyLinkedList list;

    // Insert operations from both ends
    list.insertAtTail(10);
    list.insertAtTail(20);
    list.insertAtHead(5);
    list.displayForward();
    list.displayBackward();

    // Search in both directions
    list.searchForward(20);
    list.searchBackward(20);

    // Delete operations from both ends and from the middle
    list.deleteValue(20);
    list.deleteAtHead();
    list.deleteAtTail();
    list.displayForward();
    list.displayBackward();

    return 0;
}
