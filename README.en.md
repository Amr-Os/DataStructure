# Data Structures

**English** · [العربية](README.md)

A collection of **7 standalone C++ programs**, plus an **interactive website** that visualizes the same structures step by step, in Arabic and English.

---

## Contents

- [Structures](#structures)
- [Build and run](#build-and-run)
- [Sample output](#sample-output)
- [The website](#the-website)
- [Website features](#website-features)
- [Project layout](#project-layout)
- [Requirements](#requirements)
- [Notes](#notes)

---

## Structures

| # | Structure | File | C++ methods |
|---|-----------|------|-------------|
| 1 | Stack | `stack.cpp` | `push` `pop` `peek` `display` |
| 2 | Linear Queue | `linearqueue.cpp` | `enqueue` `dequeue` `peek` `display` |
| 3 | Circular Queue | `circularqueue.cpp` | `enqueue` `dequeue` `peek` `display` |
| 4 | Singly Linked List | `linkedlist.cpp` | `insertAtHead` `insertAtTail` `deleteAtHead` `deleteValue` `search` `display` |
| 5 | Doubly Linked List | `doublylinkedlist.cpp` | `insertAtHead` `insertAtTail` `deleteAtHead` `deleteAtTail` `deleteValue` `searchForward` `searchBackward` `displayForward` `displayBackward` |
| 6 | Linear Search | `linearsearch.cpp` | `insert` `search` `display` |
| 7 | Binary Search | `binarysearch.cpp` | `insert` `search` `display` |

**Notes**
- The stack and both queues use `#define MAX_SIZE 5`.
- `binarysearch.cpp` inserts every value **at its sorted position**, because binary search only works on sorted data.
- Linear search works on unsorted data, which is why the two search programs accept the same values but behave differently.

---

## Build and run

Every program is completely standalone with its own `main()`, so any one of them can be run on its own.

```bash
# build all seven programs
make

# build (if needed) and run one program
make run-stack
make run-binarysearch

# or run the executable directly
./linearsearch

# remove the executables
make clean
```

`make` only rebuilds the files you changed.

---

## Sample output

```text
$ ./stack
Pushed: 10
Pushed: 20
Pushed: 30
Stack elements (Top -> Bottom): 30 20 10
Top element: 30
Popped: 30
Stack elements (Top -> Bottom): 20 10
```

```text
$ ./binarysearch
Inserted 40 at index 0 (array stays sorted)
Inserted 10 at index 0 (array stays sorted)
Inserted 70 at index 2 (array stays sorted)
Inserted 20 at index 1 (array stays sorted)
Array elements (sorted): 10 20 40 70

Searching for 55 with binary search
low = 0, high = 3, mid = 1 -> arr[1] = 20
20 < 55 -> keep the right half
low = 2, high = 3, mid = 2 -> arr[2] = 40
40 < 55 -> keep the right half
low = 3, high = 3, mid = 3 -> arr[3] = 70
70 > 55 -> keep the left half
55 is not in the array
```

---

## The website

The site lives in `website/` and covers the same structures visually. There is **nothing to install and no build step** — it is plain HTML, CSS and JavaScript.

**Easiest way:** double-click this file

```text
website/index.html
```

It opens and runs straight in your browser.

**Or** serve it locally if you prefer:

```bash
cd website
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

---

## Website features

- **7 tabs**, one per structure, each with its own deep link (`#stack`, `#binary-search`, ...).
- **Language switch** between English and Arabic, remembered in the browser across reloads.
- **Animations**: elements sliding in and out, deleted cells fading, and the search cells highlighting as they are compared.
- **Step-by-step search playback**:
  - Linear search compares one cell per step, from left to right.
  - Binary search shows the `low`, `high` and `mid` bounds and dims the cells it discards.
- **`Peek`**: highlights the element that was read and shows a line explaining what it read.
- **Pointer following**: click a `next` or `prev` pointer field to jump to the node it points at.
- **Operation log** recording every operation and its result.
- **Responsive** down to phone widths, with right-to-left layout in Arabic while the code, output and diagrams stay left-to-right.

> **Structure and method names stay in English** in Arabic mode, because they match the code, and so does the output of `display()`.

---

## Project layout

```text
Cpp/final/
├── Makefile              # build and run the programs
├── stack.cpp
├── linearqueue.cpp
├── circularqueue.cpp
├── linkedlist.cpp
├── doublylinkedlist.cpp
├── linearsearch.cpp
├── binarysearch.cpp
├── README.md             # Arabic version
├── README.en.md          # this file
└── website/
    ├── index.html
    ├── css/styles.css
    └── js/
        ├── i18n.js       # English and Arabic strings
        ├── structures.js # the logic of each structure
        ├── catalog.js    # tabs, operations and C++ snippets
        ├── renderers.js  # diagram rendering
        └── app.js        # wiring, state and the operation log
```

---

## Requirements

- **g++** with C++17 support.
- A **modern browser** for the website (Chrome, Firefox, Edge, Safari).
- No third-party libraries.

---

## Notes

- Each C++ program is fully independent: no shared headers and no duplicated `main`.
- The array-based structures use a fixed array; the linked lists use real pointers (`new` and `delete`).
- The project is meant for learning and for demonstrating the concepts, not for production use.
