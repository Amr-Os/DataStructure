(function () {
  'use strict';

  class StackStructure {
    constructor(capacity) {
      this.capacity = capacity;
      this.reset();
    }

    reset() {
      this.items = [];
    }

    push(value) {
      if (this.items.length >= this.capacity) {
        return {
          ok: false,
          key: 'msg.pushFull',
          vars: { capacity: this.capacity }
        };
      }
      this.items.push(value);
      return {
        ok: true,
        key: 'msg.pushOk',
        vars: { value: value, top: this.items.length - 1 },
        addedIndex: this.items.length - 1,
        addedValue: value,
        addedRole: 'top'
      };
    }

    pop() {
      if (this.items.length === 0) {
        return { ok: false, key: 'msg.stackUnderflow' };
      }
      const removedIndex = this.items.length - 1;
      const removedValue = this.items.pop();
      return {
        ok: true,
        key: 'msg.popOk',
        vars: { value: removedValue, top: this.items.length - 1 },
        removedIndex: removedIndex,
        removedValue: removedValue,
        removedRole: 'top'
      };
    }

    peek() {
      if (this.items.length === 0) {
        return { ok: false, key: 'msg.peekEmpty' };
      }
      return {
        ok: true,
        key: 'msg.peekTop',
        vars: { value: this.items[this.items.length - 1] },
        peekIndex: this.items.length - 1
      };
    }

    toText() {
      if (this.items.length === 0) {
        return 'Stack is empty.\ntop = -1';
      }
      return (
        'Stack elements (Top -> Bottom): ' + this.items.slice().reverse().join(' ') + '\n' +
        'top = ' + (this.items.length - 1) + ', size = ' + this.items.length + ' / ' + this.capacity
      );
    }

    describe() {
      const cells = [];
      for (let i = 0; i < this.capacity; i++) {
        const used = i < this.items.length;
        const isTop = used && i === this.items.length - 1;
        cells.push({
          index: i,
          value: used ? this.items[i] : null,
          role: !used ? 'empty' : isTop ? 'top' : 'used'
        });
      }
      return {
        kind: 'cells',
        orientation: 'vertical',
        cells: cells,
        size: this.items.length,
        capacity: this.capacity,
        top: this.items.length - 1,
        noteKey: 'note.stack'
      };
    }
  }

  class LinearQueueStructure {
    constructor(capacity) {
      this.capacity = capacity;
      this.reset();
    }

    reset() {
      this.slots = new Array(this.capacity).fill(null);
      this.front = -1;
      this.rear = -1;
      this.count = 0;
    }

    enqueue(value) {
      if (this.rear === this.capacity - 1) {
        return {
          ok: false,
          key: 'msg.linearFull',
          vars: { last: this.capacity - 1, front: this.front }
        };
      }
      if (this.count === 0) {
        this.front = 0;
        this.rear = 0;
      } else {
        this.rear++;
      }
      this.slots[this.rear] = value;
      this.count++;
      return {
        ok: true,
        key: 'msg.enqueueOk',
        vars: { value: value, rear: this.rear },
        addedIndex: this.rear,
        addedValue: value,
        addedRole: 'rear'
      };
    }

    dequeue() {
      if (this.count === 0) {
        return { ok: false, key: 'msg.queueUnderflow' };
      }
      const removedIndex = this.front;
      const removedValue = this.slots[removedIndex];
      this.slots[removedIndex] = null;
      this.front++;
      this.count--;
      if (this.count === 0) {
        this.front = -1;
        this.rear = -1;
      }
      return {
        ok: true,
        key: 'msg.dequeueOk',
        vars: { value: removedValue, front: removedIndex },
        removedIndex: removedIndex,
        removedValue: removedValue,
        removedRole: 'front'
      };
    }

    peek() {
      if (this.count === 0) {
        return { ok: false, key: 'msg.peekEmptyQueue' };
      }
      return {
        ok: true,
        key: 'msg.peekFront',
        vars: { value: this.slots[this.front] },
        peekIndex: this.front
      };
    }

    toText() {
      const strip = this.slots
        .map(function (v, i) {
          const inside = !this.isEmpty() && i >= this.front && i <= this.rear;
          return inside ? v : '_';
        }, this)
        .join(' | ');

      let out = 'Array slots [0..' + (this.capacity - 1) + ']: ' + strip + '\n';
      if (this.isEmpty()) {
        out += 'Queue is empty.\nfront = rear = -1';
        return out;
      }
      const values = [];
      for (let i = this.front; i <= this.rear; i++) {
        values.push(this.slots[i]);
      }
      out += 'Queue elements (Front -> Rear): ' + values.join(' ') + '\n';
      out += 'front = ' + this.front + ', rear = ' + this.rear +
        ', size = ' + this.count + ' / ' + this.capacity;
      return out;
    }

    isEmpty() {
      return this.count === 0;
    }

    describe() {
      const cells = [];
      for (let i = 0; i < this.capacity; i++) {
        let role = 'empty';
        if (!this.isEmpty() && i >= this.front && i <= this.rear) {
          role = i === this.front && i === this.rear ? 'frontrear'
            : i === this.front ? 'front'
              : i === this.rear ? 'rear' : 'used';
        } else if (!this.isEmpty() && i < this.front) {
          role = 'wasted';
        }
        cells.push({
          index: i,
          value: role === 'empty' || role === 'wasted' ? null : this.slots[i],
          role: role
        });
      }
      return {
        kind: 'cells',
        orientation: 'horizontal',
        cells: cells,
        size: this.count,
        capacity: this.capacity,
        front: this.isEmpty() ? -1 : this.front,
        rear: this.isEmpty() ? -1 : this.rear,
        noteKey: 'note.linearQueue'
      };
    }
  }

  class CircularQueueStructure {
    constructor(capacity) {
      this.capacity = capacity;
      this.reset();
    }

    reset() {
      this.slots = new Array(this.capacity).fill(null);
      this.front = 0;
      this.rear = this.capacity - 1;
      this.count = 0;
    }

    enqueue(value) {
      if (this.count === this.capacity) {
        return {
          ok: false,
          key: 'msg.circularFull',
          vars: { capacity: this.capacity }
        };
      }
      this.rear = (this.rear + 1) % this.capacity;
      this.slots[this.rear] = value;
      this.count++;
      return {
        ok: true,
        key: this.rear < this.front ? 'msg.enqueueOkWrap' : 'msg.enqueueOk',
        vars: { value: value, rear: this.rear },
        addedIndex: this.rear,
        addedValue: value,
        addedRole: 'rear'
      };
    }

    dequeue() {
      if (this.count === 0) {
        return { ok: false, key: 'msg.queueUnderflow' };
      }
      const removedIndex = this.front;
      const removedValue = this.slots[removedIndex];
      this.slots[removedIndex] = null;
      this.front = (this.front + 1) % this.capacity;
      this.count--;
      return {
        ok: true,
        key: 'msg.dequeueOk',
        vars: { value: removedValue, front: removedIndex },
        removedIndex: removedIndex,
        removedValue: removedValue,
        removedRole: 'front'
      };
    }

    peek() {
      if (this.count === 0) {
        return { ok: false, key: 'msg.peekEmptyQueue' };
      }
      return {
        ok: true,
        key: 'msg.peekFront',
        vars: { value: this.slots[this.front] },
        peekIndex: this.front
      };
    }

    toText() {
      let out = 'Array slots [0..' + (this.capacity - 1) + ']: ' + this.slots
        .map(function (v) { return v === null ? '_' : v; })
        .join(' | ') + '\n';
      if (this.count === 0) {
        out += 'Queue is empty.\nfront = rear = -1';
        return out;
      }
      const values = [];
      let index = this.front;
      for (let i = 0; i < this.count; i++) {
        values.push(this.slots[index]);
        index = (index + 1) % this.capacity;
      }
      out += 'Queue elements (Front -> Rear): ' + values.join(' ') + '\n';
      out += 'front = ' + this.front + ', rear = ' + this.rear +
        ', size = ' + this.count + ' / ' + this.capacity;
      return out;
    }

    isEmpty() {
      return this.count === 0;
    }

    describe() {
      const cells = [];
      for (let i = 0; i < this.capacity; i++) {
        let role = 'empty';
        if (this.count > 0) {
          if (this.front <= this.rear) {
            if (i >= this.front && i <= this.rear) {
              role = i === this.front && i === this.rear ? 'frontrear'
                : i === this.front ? 'front'
                  : i === this.rear ? 'rear' : 'used';
            }
          } else if (i >= this.front || i <= this.rear) {
            role = i === this.front && i === this.rear ? 'frontrear'
              : i === this.front ? 'front'
                : i === this.rear ? 'rear' : 'used';
          }
        }
        cells.push({
          index: i,
          value: role === 'empty' ? null : this.slots[i],
          role: role
        });
      }
      return {
        kind: 'ring',
        cells: cells,
        size: this.count,
        capacity: this.capacity,
        front: this.count === 0 ? -1 : this.front,
        rear: this.count === 0 ? -1 : this.rear,
        noteKey: 'note.circularQueue'
      };
    }
  }

  class LinkedListStructure {
    constructor() {
      this.reset();
    }

    reset() {
      this.nodes = [];
      this.nextId = 1;
    }

    insertAtHead(value) {
      this.nodes.unshift({ id: this.nextId++, value: value });
      return {
        ok: true,
        key: 'msg.listInsertHead',
        vars: { value: value },
        addedIndex: 0,
        addedValue: value
      };
    }

    insertAtTail(value) {
      this.nodes.push({ id: this.nextId++, value: value });
      return {
        ok: true,
        key: 'msg.listInsertTail',
        vars: { value: value, length: this.nodes.length },
        addedIndex: this.nodes.length - 1,
        addedValue: value
      };
    }

    deleteAtHead() {
      if (this.nodes.length === 0) {
        return { ok: false, key: 'msg.listUnderflow' };
      }
      const node = this.nodes.shift();
      return {
        ok: true,
        key: 'msg.listDeleteHead',
        vars: { value: node.value, length: this.nodes.length },
        removedIndex: 0,
        removedValue: node.value
      };
    }

    deleteAtTail() {
      if (this.nodes.length === 0) {
        return { ok: false, key: 'msg.listUnderflow' };
      }
      const node = this.nodes.pop();
      return {
        ok: true,
        key: 'msg.listDeleteTail',
        vars: { value: node.value, length: this.nodes.length },
        removedIndex: this.nodes.length,
        removedValue: node.value
      };
    }

    deleteValue(value) {
      if (this.nodes.length === 0) {
        return { ok: false, key: 'msg.listUnderflow' };
      }
      const index = this.nodes.findIndex(function (n) { return n.value === value; });
      if (index === -1) {
        return { ok: false, key: 'msg.deleteValueMiss', vars: { value: value } };
      }
      this.nodes.splice(index, 1);
      return {
        ok: true,
        key: 'msg.deleteValueOk',
        vars: { value: value, index: index, length: this.nodes.length },
        removedIndex: index,
        removedValue: value
      };
    }

    search(value) {
      const index = this.nodes.findIndex(function (n) { return n.value === value; });
      if (index === -1) {
        return { ok: false, key: 'msg.searchMiss', vars: { value: value } };
      }
      return {
        ok: true,
        key: 'msg.searchOk',
        vars: { value: value, index: index, steps: index + 1 }
      };
    }

    toText() {
      if (this.nodes.length === 0) {
        return 'List is empty (head = nullptr).';
      }
      const chain = this.nodes.map(function (n) { return n.value; }).join(' ');
      return 'List elements (Head -> Tail): ' + chain + ' -> nullptr\nlength = ' + this.nodes.length;
    }

    describe() {
      return {
        kind: 'list',
        nodes: this.nodes.map(function (n) { return { id: n.id, value: n.value }; }),
        size: this.nodes.length,
        noteKey: 'note.linkedList'
      };
    }
  }

  class DoublyLinkedListStructure extends LinkedListStructure {
    insertAtHead(value) {
      const res = LinkedListStructure.prototype.insertAtHead.call(this, value);
      res.key = 'msg.dllInsertHead';
      res.vars = { value: value };
      return res;
    }

    insertAtTail(value) {
      const res = LinkedListStructure.prototype.insertAtTail.call(this, value);
      res.key = 'msg.dllInsertTail';
      res.vars = { value: value };
      return res;
    }

    deleteAtHead() {
      const res = LinkedListStructure.prototype.deleteAtHead.call(this);
      if (res.ok) {
        res.key = 'msg.dllDeleteHead';
        res.vars = { value: res.vars.value, length: this.nodes.length };
      }
      return res;
    }

    deleteAtTail() {
      const res = LinkedListStructure.prototype.deleteAtTail.call(this);
      if (res.ok) {
        res.key = 'msg.dllDeleteTail';
        res.vars = { value: res.vars.value, length: this.nodes.length };
      }
      return res;
    }

    searchForward(value) {
      const index = this.nodes.findIndex(function (n) { return n.value === value; });
      if (index === -1) {
        return { ok: false, key: 'msg.searchFwdMiss', vars: { value: value } };
      }
      return {
        ok: true,
        key: 'msg.searchFwdOk',
        vars: { value: value, index: index }
      };
    }

    searchBackward(value) {
      const index = this.nodes.map(function (n) { return n.value; }).lastIndexOf(value);
      if (index === -1) {
        return { ok: false, key: 'msg.searchBackMiss', vars: { value: value } };
      }
      return {
        ok: true,
        key: 'msg.searchBackOk',
        vars: { value: value, index: index, steps: this.nodes.length - index }
      };
    }

    toText() {
      if (this.nodes.length === 0) {
        return 'List is empty (head = tail = nullptr).';
      }
      const forward = this.nodes.map(function (n) { return n.value; }).join(' ');
      const backward = this.nodes.map(function (n) { return n.value; }).reverse().join(' ');
      return 'List elements (Head -> Tail): ' + forward + ' -> nullptr\n' +
        'List elements (Tail -> Head): ' + backward + ' -> nullptr\n' +
        'length = ' + this.nodes.length;
    }

    describe() {
      return {
        kind: 'dlist',
        nodes: this.nodes.map(function (n) { return { id: n.id, value: n.value }; }),
        size: this.nodes.length,
        noteKey: 'note.doublyLinkedList'
      };
    }
  }

  // Shared array behaviour for the two search demos. `sorted` decides whether
  // insert() keeps the array in ascending order, which is the one requirement
  // binary search has and linear search does not.
  class SearchArrayStructure {
    constructor(capacity, sorted) {
      this.capacity = capacity;
      this.sorted = sorted;
      this.variant = sorted ? 'binary' : 'linear';
      this.reset();
    }

    reset() {
      this.slots = new Array(this.capacity).fill(null);
      this.count = 0;
    }

    insert(value) {
      if (this.count === this.capacity) {
        return {
          ok: false,
          key: 'msg.arrayFull',
          vars: { value: value, capacity: this.capacity }
        };
      }

      let index = this.count;
      if (this.sorted) {
        // Shift bigger values right so the array stays sorted for binary search
        index = this.count;
        while (index > 0 && this.slots[index - 1] > value) {
          this.slots[index] = this.slots[index - 1];
          index--;
        }
        this.slots[index] = value;
        this.count++;
      } else {
        this.slots[this.count] = value;
        this.count++;
      }

      return {
        ok: true,
        key: this.sorted ? 'msg.arrayInsertSorted' : 'msg.arrayInsert',
        vars: { value: value, index: index },
        addedIndex: index,
        addedValue: value
      };
    }

    deleteValue(value) {
      if (this.count === 0) {
        return { ok: false, key: 'msg.arrayEmpty' };
      }
      const index = this.slots.indexOf(value);
      if (index === -1 || index >= this.count) {
        return { ok: false, key: 'msg.arrayDeleteMiss', vars: { value: value } };
      }
      this.slots.splice(index, 1);
      this.slots.length = this.capacity;
      this.count--;
      return {
        ok: true,
        key: 'msg.arrayDeleteOk',
        vars: { value: value, index: index },
        removedIndex: index,
        removedValue: value
      };
    }

    toText() {
      if (this.count === 0) {
        return 'Array is empty.';
      }
      const values = [];
      for (let i = 0; i < this.count; i++) {
        values.push(this.slots[i]);
      }
      return (this.sorted ? 'Array elements (sorted): ' : 'Array elements: ') + values.join(' ');
    }

    describe() {
      const cells = [];
      for (let i = 0; i < this.capacity; i++) {
        const used = i < this.count;
        cells.push({
          index: i,
          value: used ? this.slots[i] : null,
          role: used ? 'used' : 'empty'
        });
      }
      return {
        kind: 'search',
        variant: this.variant,
        cells: cells,
        size: this.count,
        capacity: this.capacity,
        noteKey: this.sorted ? 'note.binarySearch' : 'note.linearSearch'
      };
    }
  }

  class LinearSearchStructure extends SearchArrayStructure {
    constructor(capacity) {
      super(capacity, false);
    }

    search(key) {
      if (this.count === 0) {
        return { ok: false, key: 'msg.arrayEmpty' };
      }

      const steps = [];
      for (let i = 0; i < this.count; i++) {
        if (this.slots[i] === key) {
          steps.push({ index: i, value: this.slots[i], hit: true });
          return {
            ok: true,
            key: 'msg.linearSearchFound',
            vars: { key: key, index: i, checks: i + 1 },
            trace: { kind: 'linear', key: key, steps: steps, found: true, index: i, checks: i + 1 }
          };
        }
        steps.push({ index: i, value: this.slots[i], hit: false });
      }
      return {
        ok: false,
        key: 'msg.linearSearchMiss',
        vars: { key: key, checks: this.count },
        trace: { kind: 'linear', key: key, steps: steps, found: false, checks: this.count }
      };
    }
  }

  class BinarySearchStructure extends SearchArrayStructure {
    constructor(capacity) {
      super(capacity, true);
    }

    search(key) {
      if (this.count === 0) {
        return { ok: false, key: 'msg.arrayEmpty' };
      }

      const steps = [];
      let low = 0;
      let high = this.count - 1;

      while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        const value = this.slots[mid];
        const step = { low: low, high: high, mid: mid, value: value, key: key };

        if (value === key) {
          step.outcome = 'found';
          steps.push(step);
          return {
            ok: true,
            key: 'msg.binarySearchFound',
            vars: { key: key, index: mid, checks: steps.length },
            trace: {
              kind: 'binary',
              key: key,
              steps: steps,
              found: true,
              index: mid,
              checks: steps.length,
              low: low,
              high: high,
              mid: mid
            }
          };
        }

        if (value < key) {
          step.outcome = 'right';
          steps.push(step);
          low = mid + 1;
        } else {
          step.outcome = 'left';
          steps.push(step);
          high = mid - 1;
        }
      }

      return {
        ok: false,
        key: 'msg.binarySearchMiss',
        vars: { key: key, checks: steps.length },
        trace: { kind: 'binary', key: key, steps: steps, found: false, checks: steps.length }
      };
    }
  }

  window.Structures = {
    StackStructure: StackStructure,
    LinearQueueStructure: LinearQueueStructure,
    CircularQueueStructure: CircularQueueStructure,
    LinkedListStructure: LinkedListStructure,
    DoublyLinkedListStructure: DoublyLinkedListStructure,
    LinearSearchStructure: LinearSearchStructure,
    BinarySearchStructure: BinarySearchStructure
  };
})();
