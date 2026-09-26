(function () {
  'use strict';

  const STORE_KEY = 'dsv.lang';
  const DEFAULT_LANG = 'en';

  const STRINGS = {
    en: {
      'doc.title': 'Data Structures Visualiser',
      'brand.title': 'Data Structures Visualiser',
      'brand.list': 'Stack · Linear Queue · Circular Queue · Singly Linked List · Doubly Linked List',
      'brand.note': 'Same operations as the C++ classes in the parent folder, one method at a time.',
      'tabs.aria': 'Choose a data structure',
      'lang.switch': 'العربية',
      'lang.title': 'Switch to Arabic',

      'panel.operations': 'Operations',
      'panel.value': 'Value',
      'panel.capacity': 'Capacity',
      'panel.state': 'Current state',
      'panel.raw': 'Memory + display() output',
      'panel.log': 'Operation log',
      'group.add': 'Add',
      'group.del': 'Delete',
      'group.inspect': 'Inspect',
      'btn.fill': 'Fill random',
      'btn.clear': 'Clear',
      'cpp.summary': 'C++ class behind this tab',
      'value.placeholder': 'auto: {n}',

      'log.fill': 'Fill',
      'log.clear': 'Clear',
      'log.capacity': 'Capacity',
      'log.ready': 'Ready',
      'log.fillMsg': 'Added {count} random value(s).',
      'log.clearMsg': 'Structure reset to its empty state.',
      'log.capacityMsg': 'Rebuilt {name} with capacity {capacity}.',
      'log.readyMsg': 'Five structures loaded. Pick one above, then add and delete values.',
      'log.empty': 'No operations yet. Try a Fill or a Push.',
      'log.autoFilled': ' (auto-filled {value})',
      'err.needsValue': 'This operation needs a value. Type one in the Value box first.',
      'err.notInteger': '"{raw}" is not a whole number. The C++ classes store int values.',

      'chip.size': 'size',
      'chip.capacity': 'capacity',
      'chip.top': 'top',
      'chip.front': 'front',
      'chip.rear': 'rear',
      'chip.head': 'head',
      'chip.tail': 'tail',

      'name.stack': 'Stack',
      'name.linearQueue': 'Linear Queue',
      'name.circularQueue': 'Circular Queue',
      'name.linkedList': 'Singly Linked List',
      'name.doublyLinkedList': 'Doubly Linked List',

      'short.stack': 'LIFO',
      'short.linearQueue': 'FIFO array',
      'short.circularQueue': 'Ring buffer',
      'short.linkedList': 'SLL',
      'short.doublyLinkedList': 'DLL',

      'tag.stack': 'Last in, first out. Insert and remove happen at the top only.',
      'tag.linearQueue': 'First in, first out. Insert at rear, remove from front, no wrapping.',
      'tag.circularQueue': 'Same FIFO idea, but the indices wrap with modulo so freed slots get reused.',
      'tag.linkedList': 'Chained nodes, each holding data and one next pointer. No fixed capacity.',
      'tag.doublyLinkedList': 'Nodes keep prev and next, so the list can be walked forwards and backwards.',

      'op.push': 'Push',
      'op.pop': 'Pop',
      'op.peek': 'Peek',
      'op.enqueue': 'Enqueue',
      'op.dequeue': 'Dequeue',
      'op.insertAtHead': 'Insert at head',
      'op.insertAtTail': 'Insert at tail',
      'op.deleteAtHead': 'Delete at head',
      'op.deleteAtTail': 'Delete at tail',
      'op.deleteValue': 'Delete by value',
      'op.search': 'Search',
      'op.searchForward': 'Search forward',
      'op.searchBackward': 'Search backward',

      'hint.push': 'Add the value to the top slot',
      'hint.pop': 'Remove the value from the top slot',
      'hint.peek': 'Read the top value without removing it',
      'hint.enqueue': 'Add the value at the rear',
      'hint.dequeue': 'Remove the value at the front',
      'hint.enqueueWrap': 'Add at rear, wrapping past the last slot',
      'hint.dequeueWrap': 'Remove at front, wrapping past the last slot',
      'hint.peekFront': 'Read the front value',
      'hint.insertAtHead': 'New node becomes the head',
      'hint.insertAtTail': 'Walk to the end and link a new node',
      'hint.deleteAtHead': 'Unlink the head node',
      'hint.deleteValue': 'Find a value and unlink that node',
      'hint.search': 'Walk from head looking for a value',
      'hint.dllInsertAtHead': 'New node becomes head, old head links back',
      'hint.dllInsertAtTail': 'O(1) insert using the tail pointer',
      'hint.dllDeleteAtHead': 'Unlink head and fix the new prev',
      'hint.dllDeleteAtTail': 'O(1) delete using the tail pointer',
      'hint.dllDeleteValue': 'Find a value then repair both links',
      'hint.searchForward': 'Walk from head using next',
      'hint.searchBackward': 'Walk from tail using prev',

      'hint.arrayInsert': 'Append the value at the end of the array',
      'hint.arrayInsertSorted': 'Insert the value in its sorted position',
      'hint.arrayDelete': 'Find the value and remove that slot',
      'hint.linearSearch': 'Compare the key with every element, left to right',
      'hint.binarySearch': 'Halve the range [low, high] until the key is found',

      'msg.pushOk': 'Pushed {value}. top = {top}.',
      'msg.pushFull': 'Stack Overflow: capacity {capacity} reached.',
      'msg.popOk': 'Popped {value}. new top = {top}.',
      'msg.stackUnderflow': 'Stack Underflow: stack is already empty.',
      'msg.peekEmpty': 'Stack Underflow: nothing to peek.',
      'msg.peekTop': 'Top = {value}.',

      'msg.enqueueOk': 'Enqueued {value} at rear = {rear}.',
      'msg.enqueueOkWrap': 'Enqueued {value} at rear = {rear} (wrapped to the start).',
      'msg.linearFull': 'Queue Overflow: rear reached slot {last}. A linear queue cannot wrap, so free slot {front} stays wasted.',
      'msg.circularFull': 'Queue Overflow: all {capacity} slots are occupied, so there is no free slot left after wrapping around.',
      'msg.dequeueOk': 'Dequeued {value} from front = {front}.',
      'msg.queueUnderflow': 'Queue Underflow: queue is already empty.',
      'msg.peekEmptyQueue': 'Queue Underflow: nothing to peek.',
      'msg.peekFront': 'Front = {value}.',

      'msg.listInsertHead': 'Inserted {value} at the head, so it is the new n1.',
      'msg.listInsertTail': 'Inserted {value} at the tail. length = {length}.',
      'msg.listDeleteHead': 'Deleted {value} from the head. length = {length}.',
      'msg.listDeleteTail': 'Deleted {value} from the tail. length = {length}.',
      'msg.listUnderflow': 'List Underflow: list is already empty.',
      'msg.deleteValueMiss': 'Value {value} not found in the list.',
      'msg.deleteValueOk': 'Deleted value {value} found at position {index}. length = {length}.',
      'msg.searchMiss': 'Searched the whole list: {value} not found.',
      'msg.searchOk': 'Found {value} at position {index} after {steps} step(s) from head.',

      'msg.dllInsertHead': 'Inserted {value} at the head. The old head, now n2, links back with prev = n1.',
      'msg.dllInsertTail': 'Inserted {value} at the tail in O(1) using the tail pointer, so the old tail links forward to it.',
      'msg.dllDeleteHead': 'Deleted {value} from the head, and detached the new head with prev = nullptr. length = {length}.',
      'msg.dllDeleteTail': 'Deleted {value} from the tail, and detached the new tail with next = nullptr. length = {length}.',
      'msg.searchFwdMiss': 'Forward search from head: {value} not found.',
      'msg.searchFwdOk': 'Forward search from head found {value} at position {index}.',
      'msg.searchBackMiss': 'Backward search from tail: {value} not found.',
      'msg.searchBackOk': 'Backward search from tail found {value} at position {index} after {steps} step(s).',

      'note.stack': 'Only the top slot is accessible. Everything below it is untouched memory.',
      'note.linearQueue': 'front only moves right and rear only moves right, so freed slots are never reused.',
      'note.circularQueue': 'rear = (rear + 1) % capacity and front = (front + 1) % capacity, so freed slots get reused.',
      'note.linkedList': 'Each node stores data plus the address of the next node, so nodes are scattered in memory but chained together.',
      'note.doublyLinkedList': 'Each node stores prev as well as next, so the list can be walked in both directions and the tail is reached in O(1).',

      'msg.arrayFull': 'Array Overflow! Cannot insert {value}, all {capacity} slots are used.',
      'msg.arrayInsert': 'Inserted {value} at index {index}.',
      'msg.arrayInsertSorted': 'Inserted {value} at index {index} (the array stays sorted for binary search).',
      'msg.arrayDeleteOk': 'Deleted {value} from index {index}.',
      'msg.arrayDeleteMiss': 'Value {value} is not in the array.',
      'msg.arrayEmpty': 'The array is empty, so there is nothing to search.',
      'msg.linearSearchFound': 'Found {key} at index {index} after {checks} comparison(s).',
      'msg.linearSearchMiss': 'Not found: {key} is not in the array after {checks} comparison(s).',
      'msg.binarySearchFound': 'Found {key} at index {index} after {checks} step(s).',
      'msg.binarySearchMiss': 'Not found: low crossed high, so {key} is not in the array after {checks} step(s).',

      'name.linearSearch': 'Linear Search',
      'name.binarySearch': 'Binary Search',
      'short.linearSearch': 'O(n)',
      'short.binarySearch': 'O(log n)',
      'tag.linearSearch': 'Walks the array one element at a time, so it works on unsorted data.',
      'tag.binarySearch': 'Halves the search range every step, so it only works on sorted data.',
      'op.insert': 'Insert',
      'note.linearSearch': 'Linear search compares the key with every element from left to right, so it needs up to size comparisons and does not care about the order.',
      'note.binarySearch': 'Binary search keeps the range [low, high] and always looks at its middle, so it needs sorted data and about log2(size) comparisons.',

      'tag.low': 'low',
      'tag.mid': 'mid',
      'tag.high': 'high',
      'tag.compare': 'compare',
      'tag.hit': 'found',
      'tag.checked': 'checked',
      'tag.outRange': 'out of range',

      'viz.searchLinearStep': 'comparing index {index}: {value} against key {key}',
      'viz.searchBinaryStep': 'low = {low}, high = {high}, mid = {mid} gives arr[{mid}] = {value}',
      'viz.searchGoRight': '{value} is smaller than {key}, so keep the right half',
      'viz.searchGoLeft': '{value} is bigger than {key}, so keep the left half',
      'viz.searchDoneFound': 'found {key} at index {index} after {checks} comparison(s)',
      'viz.searchDoneMiss': 'scanned the whole range and {key} is not in the array',
      'viz.searchLegendLinear': 'one cell is compared per step, from left to right',
      'viz.searchLegendBinary': 'the range halves each step: low, mid and high move inward',

      'tag.top': 'top',
      'tag.front': 'front',
      'tag.rear': 'rear',
      'tag.frontRear': 'front + rear',
      'tag.wasted': 'wasted',
      'tag.leaving': 'removing',
      'tag.peek': 'peek',
      'badge.head': 'head',
      'badge.tail': 'tail',

      'viz.linearCaption': 'insertion at the rear (right)  ·  removal from the front (left)',
      'viz.stripTitle': 'underlying array (same slots, laid out flat)',
      'viz.ringFull': 'full',
      'viz.ringEmpty': 'empty',
      'viz.ringUsed': 'slots used',
      'viz.ringCaption': 'indices increase clockwise · rear wraps past {last} back to 0',
      'viz.emptyList': 'empty list',
      'viz.listCaption': 'each box is one node in memory · data on the left, next pointer on the right · the tail next is nullptr',
      'viz.dlistForward': 'forward walk: head → tail using next',
      'viz.dlistBackward': 'backward walk: tail → head using prev · head prev and tail next are nullptr',
      'viz.peekReadout': 'peek() returned {value} — the element was not removed',
      'viz.followPointer': 'click to follow the pointer to {target}',
      'viz.peekNone': 'nothing to peek: the structure is empty'
    },

    ar: {
      'doc.title': 'مُصوِّر هياكل البيانات',
      'brand.title': 'مُصوِّر هياكل البيانات',
      'brand.list': 'مكدّس · طابور خطي · طابور دائري · قائمة مرتبطة أحادية · قائمة مرتبطة ثنائية',
      'brand.note': 'نفس عمليات أصناف C++ الموجودة في المجلد الأب، عملية واحدة في كل مرة.',
      'tabs.aria': 'اختر هيكل البيانات',
      'lang.switch': 'English',
      'lang.title': 'التبديل إلى الإنجليزية',

      'panel.operations': 'العمليات',
      'panel.value': 'القيمة',
      'panel.capacity': 'السعة',
      'panel.state': 'الحالة الحالية',
      'panel.raw': 'الذاكرة + إخراج display()',
      'panel.log': 'سجل العمليات',
      'group.add': 'إضافة',
      'group.del': 'حذف',
      'group.inspect': 'فحص',
      'btn.fill': 'تعبئة عشوائية',
      'btn.clear': 'تفريغ',
      'cpp.summary': 'صنف C++ خلف هذا التبويب',
      'value.placeholder': 'تلقائي: {n}',

      'log.fill': 'تعبئة',
      'log.clear': 'تفريغ',
      'log.capacity': 'السعة',
      'log.ready': 'جاهز',
      'log.fillMsg': 'تمت إضافة {count} قيمة عشوائية.',
      'log.clearMsg': 'أُعيدت البنية إلى حالتها الفارغة.',
      'log.capacityMsg': 'أُعيد بناء {name} بسعة {capacity}.',
      'log.readyMsg': 'تم تحميل خمس هياكل. اختر واحداً من الأعلى، ثم أضف القيم واحذفها.',
      'log.empty': 'لا توجد عمليات بعد. جرّب التعبئة أو الدفع.',
      'log.autoFilled': ' (تعبئة تلقائية {value})',
      'err.needsValue': 'هذه العملية تحتاج إلى قيمة. اكتب قيمة في حقل «القيمة» أولاً.',
      'err.notInteger': '"{raw}" ليس عدداً صحيحاً. أصناف C++ تخزّن قيم int.',

      'chip.size': 'الحجم',
      'chip.capacity': 'السعة',
      'chip.top': 'القمة',
      'chip.front': 'المقدمة',
      'chip.rear': 'المؤخرة',
      'chip.head': 'المقدمة',
      'chip.tail': 'المؤخرة',

      'name.stack': 'مكدّس',
      'name.linearQueue': 'طابور خطي',
      'name.circularQueue': 'طابور دائري',
      'name.linkedList': 'قائمة مرتبطة أحادية',
      'name.doublyLinkedList': 'قائمة مرتبطة ثنائية',

      'short.stack': 'LIFO',
      'short.linearQueue': 'مصفوفة FIFO',
      'short.circularQueue': 'مخزن حلقي',
      'short.linkedList': 'SLL',
      'short.doublyLinkedList': 'DLL',

      'tag.stack': 'آخر ما يدخل أول ما يخرج. الإضافة والحذف يتمّان في القمة فقط.',
      'tag.linearQueue': 'أول ما يدخل أول ما يخرج. الإضافة عند المؤخرة والحذف من المقدمة، بدون التفاف.',
      'tag.circularQueue': 'نفس فكرة الطابور، لكن الفهارس تلتف باستخدام باقي القسمة فتُعاد استخدام الخانات الفارغة.',
      'tag.linkedList': 'عقد متسلسلة، كل عقدة تحتفظ بالبيانات ومؤشر next واحد. بلا سعة ثابتة.',
      'tag.doublyLinkedList': 'العقد تحتفظ بـ prev و next معاً، فيمكن المرور على القائمة في الاتجاهين.',

      'op.push': 'دفع',
      'op.pop': 'سحب',
      'op.peek': 'قراءة القمة',
      'op.enqueue': 'إدخال',
      'op.dequeue': 'إخراج',
      'op.insertAtHead': 'إدراج في المقدمة',
      'op.insertAtTail': 'إدراج في المؤخرة',
      'op.deleteAtHead': 'حذف من المقدمة',
      'op.deleteAtTail': 'حذف من المؤخرة',
      'op.deleteValue': 'حذف بقيمة',
      'op.search': 'بحث',
      'op.searchForward': 'بحث للأمام',
      'op.searchBackward': 'بحث للخلف',

      'hint.push': 'أضف القيمة إلى خانة القمة',
      'hint.pop': 'أزل القيمة من خانة القمة',
      'hint.peek': 'اقرأ قيمة القمة دون إزالتها',
      'hint.enqueue': 'أضف القيمة عند المؤخرة',
      'hint.dequeue': 'أزل القيمة من المقدمة',
      'hint.enqueueWrap': 'أضف عند المؤخرة مع الالتفاف بعد الخانة الأخيرة',
      'hint.dequeueWrap': 'أزل من المقدمة مع الالتفاف بعد الخانة الأخيرة',
      'hint.peekFront': 'اقرأ قيمة المقدمة',
      'hint.insertAtHead': 'العقدة الجديدة تصبح المقدمة',
      'hint.insertAtTail': 'امشِ حتى النهاية واربط عقدة جديدة',
      'hint.deleteAtHead': 'افصل عقدة المقدمة',
      'hint.deleteValue': 'ابحث عن قيمة وافصل عقدتها',
      'hint.search': 'امشِ من المقدمة بحثاً عن قيمة',
      'hint.dllInsertAtHead': 'العقدة الجديدة تصبح المقدمة، والمقدمة القديمة ترتبط للخلف',
      'hint.dllInsertAtTail': 'إدراج بزمن O(1) باستخدام مؤشر المؤخرة',
      'hint.dllDeleteAtHead': 'افصل المقدمة وصحّح prev للعقدة الجديدة',
      'hint.dllDeleteAtTail': 'حذف بزمن O(1) باستخدام مؤشر المؤخرة',
      'hint.dllDeleteValue': 'ابحث عن قيمة ثم أصلح كلا المؤشرين',
      'hint.searchForward': 'امشِ من المقدمة باستخدام next',
      'hint.searchBackward': 'امشِ من المؤخرة باستخدام prev',

      'hint.arrayInsert': 'Append the value at the end of the array',
      'hint.arrayInsertSorted': 'Insert the value in its sorted position',
      'hint.arrayDelete': 'Find the value and remove that slot',
      'hint.linearSearch': 'Compare the key with every element, left to right',
      'hint.binarySearch': 'Halve the range [low, high] until the key is found',

      'msg.pushOk': 'تم دفع {value}. القمة = {top}.',
      'msg.pushFull': 'تجاوز المكدّس: تم الوصول إلى السعة {capacity}.',
      'msg.popOk': 'تم سحب {value}. القمة الجديدة = {top}.',
      'msg.stackUnderflow': 'نقص المكدّس: المكدّس فارغ بالفعل.',
      'msg.peekEmpty': 'نقص المكدّس: لا يوجد ما تقرأه.',
      'msg.peekTop': 'القمة = {value}.',

      'msg.enqueueOk': 'تم الإدخال {value} عند rear = {rear}.',
      'msg.enqueueOkWrap': 'تم الإدخال {value} عند rear = {rear} (مع الالتفاف إلى البداية).',
      'msg.linearFull': 'تجاوز الطابور: وصلت المؤخرة إلى الخانة {last}. الطابور الخطي لا يلتف، لذا تبقى الخانة الحرة {front} مهدرة.',
      'msg.circularFull': 'تجاوز الطابور: الخانات الـ{capacity} كلها مشغولة، فلم تتبقَ خانة حرة بعد الالتفاف.',
      'msg.dequeueOk': 'تم إخراج {value} من front = {front}.',
      'msg.queueUnderflow': 'نقص الطابور: الطابور فارغ بالفعل.',
      'msg.peekEmptyQueue': 'نقص الطابور: لا يوجد ما تقرأه.',
      'msg.peekFront': 'المقدمة = {value}.',

      'msg.listInsertHead': 'تم إدراج {value} في المقدمة، فهي الآن n1 الجديدة.',
      'msg.listInsertTail': 'تم إدراج {value} في المؤخرة. length = {length}.',
      'msg.listDeleteHead': 'تم حذف {value} من المقدمة. length = {length}.',
      'msg.listDeleteTail': 'تم حذف {value} من المؤخرة. length = {length}.',
      'msg.listUnderflow': 'نقص القائمة: القائمة فارغة بالفعل.',
      'msg.deleteValueMiss': 'القيمة {value} غير موجودة في القائمة.',
      'msg.deleteValueOk': 'تم حذف القيمة {value} الموجودة في الموضع {index}. length = {length}.',
      'msg.searchMiss': 'تم البحث في القائمة بالكامل: {value} غير موجودة.',
      'msg.searchOk': 'تم العثور على {value} في الموضع {index} بعد {steps} خطوة من المقدمة.',

      'msg.dllInsertHead': 'تم إدراج {value} في المقدمة. المقدمة القديمة، الآن n2، ترتبط للخلف بـ prev = n1.',
      'msg.dllInsertTail': 'تم إدراج {value} في المؤخرة بزمن O(1) باستخدام مؤشر المؤخرة، فالمؤخرة القديمة ترتبط للأمام بها.',
      'msg.dllDeleteHead': 'تم حذف {value} من المقدمة، وفصلت المقدمة الجديدة بـ prev = nullptr. length = {length}.',
      'msg.dllDeleteTail': 'تم حذف {value} من المؤخرة، وفصلت المؤخرة الجديدة بـ next = nullptr. length = {length}.',
      'msg.searchFwdMiss': 'بحث للأمام من المقدمة: {value} غير موجودة.',
      'msg.searchFwdOk': 'البحث للأمام من المقدمة وجد {value} في الموضع {index}.',
      'msg.searchBackMiss': 'بحث للخلف من المؤخرة: {value} غير موجودة.',
      'msg.searchBackOk': 'البحث للخلف من المؤخرة وجد {value} في الموضع {index} بعد {steps} خطوة.',

      'note.stack': 'خانة القمة وحدها هي المتاحة، وكل ما تحتها ذاكرة لم تُمس.',
      'note.linearQueue': 'المقدمة تتحرك يميناً فقط والمؤخرة تتحرك يميناً فقط، لذا لا تُعاد استخدام الخانات المُحرَّرة أبداً.',
      'note.circularQueue': 'rear = (rear + 1) % capacity و front = (front + 1) % capacity، لذا تُعاد استخدام الخانات المُحرَّرة.',
      'note.linkedList': 'كل عقدة تخزّن البيانات إضافةً إلى عنوان العقدة التالية، لذا تتناثر العقد في الذاكرة لكنها متسلسلة.',
      'note.doublyLinkedList': 'كل عقدة تخزّن prev إضافةً إلى next، لذا يمكن المرور على القائمة في الاتجاهين ويكون الوصول إلى المؤخرة بزمن O(1).',

      'msg.arrayFull': 'تجاوز المصفوفة! لا يمكن إدراج {value}، الخانات الـ{capacity} كلها مستخدمة.',
      'msg.arrayInsert': 'تم إدراج {value} في الموضع {index}.',
      'msg.arrayInsertSorted': 'تم إدراج {value} في الموضع {index} (المصفوفة تبقى مرتبة لبحث ثنائي).',
      'msg.arrayDeleteOk': 'تم حذف {value} من الموضع {index}.',
      'msg.arrayDeleteMiss': 'القيمة {value} غير موجودة في المصفوفة.',
      'msg.arrayEmpty': 'المصفوفة فارغة، لا يوجد ما تبحث عنه.',
      'msg.linearSearchFound': 'تم العثور على {key} في الموضع {index} بعد {checks} مقارنة.',
      'msg.linearSearchMiss': 'غير موجود: {key} ليست في المصفوفة بعد {checks} مقارنة.',
      'msg.binarySearchFound': 'تم العثور على {key} في الموضع {index} بعد {checks} خطوة.',
      'msg.binarySearchMiss': 'غير موجود: تجاوز low الحد high، فـ {key} ليست في المصفوفة بعد {checks} خطوة.',

      'name.linearSearch': 'Linear Search',
      'name.binarySearch': 'Binary Search',
      'short.linearSearch': 'O(n)',
      'short.binarySearch': 'O(log n)',
      'tag.linearSearch': 'يمر على المصفوفة عنصراً بعد عنصر، فيعمل على بيانات غير مرتبة.',
      'tag.binarySearch': 'يصفّر نطاق البحث في كل خطوة، فيعمل على بيانات مرتبة فقط.',
      'op.insert': 'Insert',
      'note.linearSearch': 'البحث الخطي يقارن المفتاح بكل عنصر من اليسار إلى اليمين، فيحتاج حتى عدد العناصر من المقارنات ولا يهتم بالترتيب.',
      'note.binarySearch': 'البحث الثنائي يبقي على النطاق [low, high] وينظر دائماً إلى منتصفه، فيحتاج بيانات مرتبة وحوالي log2(عدد العناصر) مقارنة.',

      'tag.low': 'low',
      'tag.mid': 'mid',
      'tag.high': 'high',
      'tag.compare': 'مقارنة',
      'tag.hit': 'موجود',
      'tag.checked': 'تم فحصه',
      'tag.outRange': 'خارج النطاق',

      'viz.searchLinearStep': 'مقارنة الموضع {index}: {value} مع المفتاح {key}',
      'viz.searchBinaryStep': 'low = {low}، high = {high}، mid = {mid} تعطي arr[{mid}] = {value}',
      'viz.searchGoRight': '{value} أصغر من {key}، لذا نحتفظ بالنصف الأيمن',
      'viz.searchGoLeft': '{value} أكبر من {key}، لذا نحتفظ بالنصف الأيسر',
      'viz.searchDoneFound': 'تم العثور على {key} في الموضع {index} بعد {checks} مقارنة',
      'viz.searchDoneMiss': 'تم فحص النطاق بالكامل و{key} ليست في المصفوفة',
      'viz.searchLegendLinear': 'خلية واحدة تُقارن في كل خطوة، من اليسار إلى اليمين',
      'viz.searchLegendBinary': 'النطاق يتصفّف في كل خطوة: low و mid و high تقترب من بعضها',

      'tag.top': 'قمة',
      'tag.front': 'مقدمة',
      'tag.rear': 'مؤخرة',
      'tag.frontRear': 'مقدمة + مؤخرة',
      'tag.wasted': 'مهدرة',
      'tag.leaving': 'تُحذف',
      'tag.peek': 'peek',
      'badge.head': 'مقدمة',
      'badge.tail': 'مؤخرة',

      'viz.linearCaption': 'الإضافة عند المؤخرة (يمين)  ·  الحذف من المقدمة (يسار)',
      'viz.stripTitle': 'المصفوفة الأساسية (نفس الخانات، معروضة بشكل مسطح)',
      'viz.ringFull': 'ممتلئ',
      'viz.ringEmpty': 'فارغ',
      'viz.ringUsed': 'خانات مستخدمة',
      'viz.ringCaption': 'تزيد الفهارس مع عقارب الساعة · تلتف المؤخرة بعد {last} وتعود إلى 0',
      'viz.emptyList': 'قائمة فارغة',
      'viz.listCaption': 'كل صندوق يمثّل عقدة واحدة في الذاكرة · البيانات على اليسار ومؤشر next على اليمين · مؤشر next في المؤخرة يساوي nullptr',
      'viz.dlistForward': 'مرور للأمام: من المقدمة إلى المؤخرة باستخدام next',
      'viz.dlistBackward': 'مرور للخلف: من المؤخرة إلى المقدمة باستخدام prev · prev في المقدمة و next في المؤخرة يساويان nullptr',
      'viz.peekReadout': 'أعادت peek() القيمة {value} — دون إزالة العنصر',
      'viz.followPointer': 'اضغط للانتقال عبر المؤشر إلى {target}',
      'viz.peekNone': 'لا يوجد ما تقرأه: البنية فارغة'
    }
  };

  // Terms that are real C++ class names, method names or member variables. They are
  // deliberately never translated, so the site always speaks the same language as
  // the .cpp files in the parent folder.
  const CODE_TERMS = [
    'name.stack',
    'name.linearQueue',
    'name.circularQueue',
    'name.linkedList',
    'name.doublyLinkedList',
    'name.linearSearch',
    'name.binarySearch',
    'op.insert',
    'tag.low',
    'tag.mid',
    'tag.high',
    'op.push',
    'op.pop',
    'op.peek',
    'op.enqueue',
    'op.dequeue',
    'op.insertAtHead',
    'op.insertAtTail',
    'op.deleteAtHead',
    'op.deleteAtTail',
    'op.deleteValue',
    'op.search',
    'op.searchForward',
    'op.searchBackward',
    'tag.top',
    'tag.front',
    'tag.rear',
    'tag.frontRear',
    'badge.head',
    'badge.tail',
    'chip.top',
    'chip.front',
    'chip.rear',
    'chip.head',
    'chip.tail'
  ];

  const isCodeTerm = function (key) {
    return CODE_TERMS.indexOf(key) !== -1;
  };

  let current = DEFAULT_LANG;

  function isArabic(lang) {
    return lang === 'ar';
  }

  function t(key, vars) {
    const table = isCodeTerm(key)
      ? STRINGS[DEFAULT_LANG]
      : (STRINGS[current] || STRINGS[DEFAULT_LANG]);
    let text = table[key];
    if (text === undefined) {
      text = STRINGS[DEFAULT_LANG][key];
    }
    if (text === undefined) {
      return key;
    }
    if (vars) {
      text = text.replace(/\{(\w+)\}/g, function (match, name) {
        return Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match;
      });
    }
    return text;
  }

  function getLang() {
    return current;
  }

  function other() {
    return current === 'ar' ? 'en' : 'ar';
  }

  function read() {
    let stored = null;
    try {
      stored = window.localStorage.getItem(STORE_KEY);
    } catch (error) {
      stored = null;
    }
    return stored === 'ar' || stored === 'en' ? stored : DEFAULT_LANG;
  }

  function write(lang) {
    try {
      window.localStorage.setItem(STORE_KEY, lang);
    } catch (error) {
      // Private browsing: the choice just will not survive a reload.
    }
  }

  function applyDocument() {
    const root = document.documentElement;
    root.lang = current;
    root.dir = isArabic(current) ? 'rtl' : 'ltr';
    document.title = t('doc.title');
  }

  // Re-render everything that carries a data-i18n attribute, plus the optional
  // data-i18n-attr targets such as aria-label and placeholder.
  function translateStatic() {
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (node) {
      const pairs = node.dataset.i18nAttr.split(',');
      pairs.forEach(function (pair) {
        const bits = pair.split(':');
        if (bits.length === 2) {
          node.setAttribute(bits[0].trim(), t(bits[1].trim()));
        }
      });
    });
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'ar') {
      return;
    }
    current = lang;
    write(lang);
    applyDocument();
    translateStatic();
    document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: lang } }));
  }

  function toggle() {
    setLang(other());
  }

  function init() {
    current = read();
    applyDocument();
  }

  window.I18n = {
    t: t,
    init: init,
    setLang: setLang,
    toggle: toggle,
    getLang: getLang,
    other: other,
    isArabic: isArabic,
    isCodeTerm: isCodeTerm,
    translateStatic: translateStatic
  };
})();
