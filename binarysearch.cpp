#include <iostream>
using namespace std;

#define MAX_SIZE 5

class BinarySearch{
private:
    int arr[MAX_SIZE];
    int size;

public:
    BinarySearch() {
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

        // Binary search only works on a sorted array, so shift bigger values right
        int i = size - 1;
        while (i >= 0 && arr[i] > value) {
            arr[i + 1] = arr[i];
            i--;
        }
        arr[i + 1] = value;
        size++;

        cout << "Inserted " << value << " at index " << (i + 1) << " (array stays sorted)\n";
    }

    void search(int key) {
        int low = 0;
        int high = size - 1;

        cout << "\nSearching for " << key << " with binary search\n";
        while (low <= high) {
            int mid = low + (high - low) / 2;
            cout << "low = " << low << ", high = " << high << ", mid = " << mid
                 << " -> arr[" << mid << "] = " << arr[mid] << "\n";

            if (arr[mid] == key) {
                cout << "Found " << key << " at index " << mid << "\n";
                return;
            }
            if (arr[mid] < key) {
                cout << arr[mid] << " < " << key << " -> keep the right half\n";
                low = mid + 1;
            } else {
                cout << arr[mid] << " > " << key << " -> keep the left half\n";
                high = mid - 1;
            }
        }
        cout << key << " is not in the array\n";
    }

    void display() {
        if (size == 0) {
            cout << "Array is empty.\n";
            return;
        }
        cout << "Array elements (sorted): ";
        for (int i = 0; i < size; i++) {
            cout << arr[i] << " ";
        }
        cout << "\n";
    }
};

int main() {
    BinarySearch b;

    // Every insert lands in its sorted position, which is what binary search needs
    b.insert(40);
    b.insert(10);
    b.insert(70);
    b.insert(20);
    b.display();

    // Search for a value that exists
    b.search(40);

    // Search for a value that is missing
    b.search(55);

    return 0;
}
