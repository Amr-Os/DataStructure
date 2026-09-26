# هياكل البيانات | Data Structures

[English](README.en.md) · **العربية**

مشروع فيه **7 برامج C++ مستقلة**، بالإضافة إلى **موقع تفاعلي** يشرح نفس الهياكل خطوة بخطوة بالرسوم المتحركة، ويدعم العربية والإنجليزية.

---

## المحتويات

- [الهياكل الموجودة](#الهياكل-الموجودة)
- [التشغيل](#التشغيل)
- [مثال على المخرجات](#مثال-على-المخرجات)
- [الموقع التفاعلي](#الموقع-التفاعلي)
- [مميزات الموقع](#مميزات-الموقع)
- [بنية المشروع](#بنية-المشروع)
- [المتطلبات](#المتطلبات)
- [ملاحظات](#ملاحظات)

---

## الهياكل الموجودة

| # | الهيكل | الملف | الدوال في C++ |
|---|--------|-------|---------------|
| 1 | المكدس Stack | `stack.cpp` | `push` `pop` `peek` `display` |
| 2 | الطابور الخطي Linear Queue | `linearqueue.cpp` | `enqueue` `dequeue` `peek` `display` |
| 3 | الطابور الدائري Circular Queue | `circularqueue.cpp` | `enqueue` `dequeue` `peek` `display` |
| 4 | القائمة المرتبطة Linked List | `linkedlist.cpp` | `insertAtHead` `insertAtTail` `deleteAtHead` `deleteValue` `search` `display` |
| 5 | القائمة المرتبطة المزدوجة Doubly Linked List | `doublylinkedlist.cpp` | `insertAtHead` `insertAtTail` `deleteAtHead` `deleteAtTail` `deleteValue` `searchForward` `searchBackward` `displayForward` `displayBackward` |
| 6 | البحث الخطي Linear Search | `linearsearch.cpp` | `insert` `search` `display` |
| 7 | البحث الثنائي Binary Search | `binarysearch.cpp` | `insert` `search` `display` |

**ملاحظة:** هياكل المكدس والطوابير تستخدم `#define MAX_SIZE 5`، والبحث الثنائي يُدخل كل قيمة في **موضعها الصحيح** حتى يبقى المصفوفة مرتبة، لأن البحث الثنائي لا يعمل إلا على بيانات مرتبة.

---

## التشغيل

كل برنامج مستقل تماماً وله `main()` خاص به، لذلك يمكن تشغيل أي واحد منها بمفرده.

```bash
# بناء البرامج السبعة كلها
make

# تشغيل برنامج واحد (يقوم بالبناء أولاً إذا لزم)
make run-stack
make run-binarysearch

# تشغيل البرنامج مباشرة بعد بنائه
./linearsearch

# حذف الملفات التنفيذية
make clean
```

عند تعديل أي ملف، `make` يقوم بإعادة بناء هذا الملف فقط.

---

## مثال على المخرجات

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

## الموقع التفاعلي

الموقع في مجلد `website/` ويشرح نفس الهياكل بشكل مرئي. **لا يحتاج إلى تثبيت أي شيء أو تشغيل أي أمر بناء**، فقط افتحه بأي متصفح حديث.

**الطريقة الأسهل:** انقر نقراً مزدوجاً على الملف

```text
website/index.html
```

سيعمل الموقع مباشرة في المتصفح.

**أو** شغّله عبر خادم محلي إذا فضّلت ذلك:

```bash
cd website
python3 -m http.server 8000
```

ثم افتح: <http://localhost:8000>

---

## مميزات الموقع

- **7 تبويبات** واحد لكل هيكل، مع رابط مباشر لكل تبويب (`#stack` مثلاً).
- **تبديل اللغة** بين العربية والإنجليزية، ويُحفظ الاختيار في المتصفح ويبقى بعد إعادة تحميل الصفحة.
- **رسوم متحركة**: انزلاق العناصر، خروج العناصر المحذوفة، وإبراز خلايا البحث أثناء المقارنة.
- **عرض البحث خطوة بخطوة**:
  - البحث الخطي يضيء خلية واحدة في كل خطوة من اليسار إلى اليمين.
  - البحث الثنائي يبيّن حدود `low` و `high` و `mid`، ويخفّف الخلايا التي استبعدها.
- **`Peek`**: يبرز العنصر المقروء ويعرض سطراً يشرح ماذا قرأ.
- **متابعة المؤشرات**: اضغط على خانة المؤشر (`next` أو `prev`) للتنقل إلى العقدة التي تشير إليها.
- **سجل العمليات**: يعرض كل عملية ونتيجتها.
- **متجاوب** مع شاشة الهاتف والحاسوب، ويدعم اتجاه الكتابة من اليمين لليسار في العربية مع إبقاء الكود والأشكال بالاتجاه اللاتيني.

> **أسماء الهياكل والدوال تظل بالإنجليزية** في الوضع العربي، لأنها مطابقة لأسماء الكود، وكذلك مخرجات الدالة `display()`.

---

## بنية المشروع

```text
Cpp/final/
├── Makefile              # بناء وتشغيل البرامج
├── stack.cpp
├── linearqueue.cpp
├── circularqueue.cpp
├── linkedlist.cpp
├── doublylinkedlist.cpp
├── linearsearch.cpp
├── binarysearch.cpp
├── README.md             # هذا الملف (العربية)
├── README.en.md          # English version
└── website/
    ├── index.html
    ├── css/styles.css
    └── js/
        ├── i18n.js       # نصوص العربية والإنجليزية
        ├── structures.js # منطق كل هيكل
        ├── catalog.js    # تعريف التبويبات والدوال
        ├── renderers.js  # رسم الأشكال
        └── app.js        # التشغيل والسجل والحالة
```

---

## المتطلبات

- **g++** يدعم معيار C++17.
- **متصفح حديث** لتشغيل الموقع (Chrome, Firefox, Edge, Safari).
- لا توجد أي مكتبات خارجية.

---

## ملاحظات

- كل برنامج C++ مستقل تماماً: لا توجد ملفات رأس مشتركة ولا تكرار في `main`.
- الهياكل غير المرتبطة تستخدم مصفوفة ثابتة، والقوائم المرتبطة تستخدم مؤشرات (`new` و `delete`).
- المشروع مخصص للتعليم وشرح المفاهيم، وليس مخصصاً للاستخدام في الإنتاج.
