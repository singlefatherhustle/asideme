# Linked List

Another approach is for each **node** to store a **value** *and* a **pointer** to the *next* node in the list. This data structure is called a **linked list** because each node is *linked* to the next.

- O(1) to access the **head** or **tail** of the list
- O(1) to add a new node to the list
- O(n) to access an element in the middle of the list because we need to follow pointers

## Diagram

```
┌─────┬───┬─┐     ┌─────┬───┬─┐     ┌─────┬───┬─┐
│     │ A │ •─────│     │ B │ •─────│     │ C │ •
└─────┴───┴─┘     └─────┴───┴─┘     └─────┴───┴─┘
      head                                   tail
```

The diagram shows a linked list with three nodes containing values A, B, and C. Each node (shown with a dot •) contains a pointer to the next node in the sequence. The head points to the first node (A), and the tail points to the last node (C).

---

*All content is proprietary and confidential.*

**Page: 10**