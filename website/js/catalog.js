(function () {
  'use strict';

  const S = window.Structures;

  window.Catalog = [
    {
      id: 'stack',
      nameKey: 'name.stack',
      shortKey: 'short.stack',
      taglineKey: 'tag.stack',
      usesCapacity: true,
      defaultCapacity: 6,
      create: function (capacity) { return new S.StackStructure(capacity); },
      ops: [
        { id: 'push', labelKey: 'op.push', kind: 'add', hintKey: 'hint.push' },
        { id: 'pop', labelKey: 'op.pop', kind: 'del', hintKey: 'hint.pop' },
        { id: 'peek', labelKey: 'op.peek', kind: 'inspect', hintKey: 'hint.peek' }
      ],
      cpp:
        '#define MAX_SIZE 5\n\n' +
        'class Stack{\n' +
        '    int arr[MAX_SIZE];\n' +
        '    int top;\n' +
        'public:\n' +
        '    bool isFull();    // top == MAX_SIZE - 1\n' +
        '    bool isEmpty();   // top == -1\n' +
        '    void push(int value);\n' +
        '    void pop();\n' +
        '    int  peek();\n' +
        '    void display();\n' +
        '};'
    },
    {
      id: 'linear-queue',
      nameKey: 'name.linearQueue',
      shortKey: 'short.linearQueue',
      taglineKey: 'tag.linearQueue',
      usesCapacity: true,
      defaultCapacity: 6,
      create: function (capacity) { return new S.LinearQueueStructure(capacity); },
      ops: [
        { id: 'enqueue', labelKey: 'op.enqueue', kind: 'add', hintKey: 'hint.enqueue' },
        { id: 'dequeue', labelKey: 'op.dequeue', kind: 'del', hintKey: 'hint.dequeue' },
        { id: 'peek', labelKey: 'op.peek', kind: 'inspect', hintKey: 'hint.peekFront' }
      ],
      cpp:
        '#define MAX_SIZE 5\n\n' +
        'class LinearQueue{\n' +
        '    int arr[MAX_SIZE];\n' +
        '    int front;\n' +
        '    int rear;\n' +
        'public:\n' +
        '    bool isFull();    // rear == MAX_SIZE - 1\n' +
        '    bool isEmpty();   // front == -1 || front > rear\n' +
        '    void enqueue(int value);\n' +
        '    void dequeue();\n' +
        '    int  peek();\n' +
        '    void display();\n' +
        '};'
    },
    {
      id: 'circular-queue',
      nameKey: 'name.circularQueue',
      shortKey: 'short.circularQueue',
      taglineKey: 'tag.circularQueue',
      usesCapacity: true,
      defaultCapacity: 6,
      create: function (capacity) { return new S.CircularQueueStructure(capacity); },
      ops: [
        { id: 'enqueue', labelKey: 'op.enqueue', kind: 'add', hintKey: 'hint.enqueueWrap' },
        { id: 'dequeue', labelKey: 'op.dequeue', kind: 'del', hintKey: 'hint.dequeueWrap' },
        { id: 'peek', labelKey: 'op.peek', kind: 'inspect', hintKey: 'hint.peekFront' }
      ],
      cpp:
        '#define MAX_SIZE 5\n\n' +
        'class CircularQueue{\n' +
        '    int arr[MAX_SIZE];\n' +
        '    int front;\n' +
        '    int rear;\n' +
        'public:\n' +
        '    bool isFull();    // (rear + 1) % MAX_SIZE == front\n' +
        '    bool isEmpty();   // front == -1\n' +
        '    void enqueue(int value);   // rear = (rear + 1) % MAX_SIZE\n' +
        '    void dequeue();            // front = (front + 1) % MAX_SIZE\n' +
        '    int  peek();\n' +
        '    void display();\n' +
        '};'
    },
    {
      id: 'linked-list',
      nameKey: 'name.linkedList',
      shortKey: 'short.linkedList',
      taglineKey: 'tag.linkedList',
      usesCapacity: false,
      create: function () { return new S.LinkedListStructure(); },
      ops: [
        { id: 'insertAtHead', labelKey: 'op.insertAtHead', kind: 'add', hintKey: 'hint.insertAtHead' },
        { id: 'insertAtTail', labelKey: 'op.insertAtTail', kind: 'add', hintKey: 'hint.insertAtTail' },
        { id: 'deleteAtHead', labelKey: 'op.deleteAtHead', kind: 'del', hintKey: 'hint.deleteAtHead' },
        { id: 'deleteValue', labelKey: 'op.deleteValue', kind: 'del', needsValue: true, hintKey: 'hint.deleteValue' },
        { id: 'search', labelKey: 'op.search', kind: 'inspect', needsValue: true, hintKey: 'hint.search' }
      ],
      cpp:
        'struct Node {\n' +
        '    int data;\n' +
        '    Node *next;\n' +
        '};\n\n' +
        'class LinkedList{\n' +
        '    Node *head;\n' +
        'public:\n' +
        '    void insertAtHead(int value);\n' +
        '    void insertAtTail(int value);\n' +
        '    void deleteAtHead();\n' +
        '    void deleteValue(int value);\n' +
        '    void search(int value);\n' +
        '    void display();\n' +
        '};'
    },
    {
      id: 'doubly-linked-list',
      nameKey: 'name.doublyLinkedList',
      shortKey: 'short.doublyLinkedList',
      taglineKey: 'tag.doublyLinkedList',
      usesCapacity: false,
      create: function () { return new S.DoublyLinkedListStructure(); },
      ops: [
        { id: 'insertAtHead', labelKey: 'op.insertAtHead', kind: 'add', hintKey: 'hint.dllInsertAtHead' },
        { id: 'insertAtTail', labelKey: 'op.insertAtTail', kind: 'add', hintKey: 'hint.dllInsertAtTail' },
        { id: 'deleteAtHead', labelKey: 'op.deleteAtHead', kind: 'del', hintKey: 'hint.dllDeleteAtHead' },
        { id: 'deleteAtTail', labelKey: 'op.deleteAtTail', kind: 'del', hintKey: 'hint.dllDeleteAtTail' },
        { id: 'deleteValue', labelKey: 'op.deleteValue', kind: 'del', needsValue: true, hintKey: 'hint.dllDeleteValue' },
        { id: 'searchForward', labelKey: 'op.searchForward', kind: 'inspect', needsValue: true, hintKey: 'hint.searchForward' },
        { id: 'searchBackward', labelKey: 'op.searchBackward', kind: 'inspect', needsValue: true, hintKey: 'hint.searchBackward' }
      ],
      cpp:
        'struct DNode {\n' +
        '    int data;\n' +
        '    DNode *prev;\n' +
        '    DNode *next;\n' +
        '};\n\n' +
        'class DoublyLinkedList{\n' +
        '    DNode *head;\n' +
        '    DNode *tail;\n' +
        'public:\n' +
        '    void insertAtHead(int value);\n' +
        '    void insertAtTail(int value);\n' +
        '    void deleteAtHead();\n' +
        '    void deleteAtTail();\n' +
        '    void deleteValue(int value);\n' +
        '    void searchForward(int value);\n' +
        '    void searchBackward(int value);\n' +
        '    void displayForward();\n' +
        '    void displayBackward();\n' +
        '};'
    },
    {
      id: 'linear-search',
      nameKey: 'name.linearSearch',
      shortKey: 'short.linearSearch',
      taglineKey: 'tag.linearSearch',
      usesCapacity: true,
      defaultCapacity: 7,
      create: function (capacity) { return new S.LinearSearchStructure(capacity); },
      ops: [
        { id: 'insert', labelKey: 'op.insert', kind: 'add', hintKey: 'hint.arrayInsert' },
        { id: 'deleteValue', labelKey: 'op.deleteValue', kind: 'del', needsValue: true, hintKey: 'hint.arrayDelete' },
        { id: 'search', labelKey: 'op.search', kind: 'inspect', needsValue: true, hintKey: 'hint.linearSearch' }
      ],
      cpp:
        '#define MAX_SIZE 5\n\n' +
        'class LinearSearch{\n' +
        'private:\n' +
        '    int arr[MAX_SIZE];\n' +
        '    int size;\n' +
        'public:\n' +
        '    bool isFull();\n' +
        '    void insert(int value);\n' +
        '    void search(int key);   // one loop, left to right\n' +
        '    void display();\n' +
        '};'
    },
    {
      id: 'binary-search',
      nameKey: 'name.binarySearch',
      shortKey: 'short.binarySearch',
      taglineKey: 'tag.binarySearch',
      usesCapacity: true,
      defaultCapacity: 7,
      create: function (capacity) { return new S.BinarySearchStructure(capacity); },
      ops: [
        { id: 'insert', labelKey: 'op.insert', kind: 'add', hintKey: 'hint.arrayInsertSorted' },
        { id: 'deleteValue', labelKey: 'op.deleteValue', kind: 'del', needsValue: true, hintKey: 'hint.arrayDelete' },
        { id: 'search', labelKey: 'op.search', kind: 'inspect', needsValue: true, hintKey: 'hint.binarySearch' }
      ],
      cpp:
        '#define MAX_SIZE 5\n\n' +
        'class BinarySearch{\n' +
        'private:\n' +
        '    int arr[MAX_SIZE];\n' +
        '    int size;\n' +
        'public:\n' +
        '    bool isFull();\n' +
        '    void insert(int value);   // keeps the array sorted\n' +
        '    void search(int key);\n' +
        '    //   int low = 0, high = size - 1;\n' +
        '    //   while (low <= high) {\n' +
        '    //       int mid = low + (high - low) / 2;\n' +
        '    //       ...\n' +
        '    //   }\n' +
        '    void display();\n' +
        '};'
    }
  ];
})();
