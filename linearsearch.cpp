#include <iostream>
using namespace std;

#define MAX_SIZE 5

class LinearSearch{
private:
    int arr[MAX_SIZE];
    int size;

public:
    LinearSearch() {
        size = 0;
    }

    bool isFull() {
        return size == MAX_SIZE;
    }

    void insert(int value) {
        if (isFull()) {
            cout << "Array Overflow! Cannot insert " << value << "\n";
            return;
        }
        arr[size] = value;
        cout << "Inserted " << value << " at index " << size << "\n";
        size++;
    }

    void search(int key) {
        cout << "\nSearching for " << key << " with linear search\n";
        // Compare the key against one element at a time, left to right
        for (int i = 0; i < size; i++) {
            cout << "arr[" << i << "] = " << arr[i];
            if (arr[i] == key) {
                cout << " == " << key << " -> found at index " << i << "\n";
                return;
            }
            cout << " != " << key << " -> move to index " << (i + 1) << "\n";
        }
        cout << key << " is not in the array\n";
    }

    void display() {
        if (size == 0) {
            cout << "Array is empty.\n";
            return;
        }
        cout << "Array elements: ";
        for (int i = 0; i < size; i++) {
            cout << arr[i] << " ";
        }
        cout << "\n";
    }
};

int main() {
    LinearSearch s;

    // Linear search needs no sorting, so the values stay in insertion order
    s.insert(40);
    s.insert(10);
    s.insert(70);
    s.insert(20);
    s.display();

    // Search for a value that exists
    s.search(70);

    // Search for a value that is missing
    s.search(55);

    return 0;
}
