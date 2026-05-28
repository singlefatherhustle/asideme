# Stacks

A stack is a *list* with LIFO (Last-In, First-Out) access. We are only allowed to **push** (add) or **pop** (remove) items from the **top**.

What are the trade-offs between using an array vs a linked list to implement a stack?

## Stack Diagram

```
Array-based Stack Implementation:

    D  ──push──>  top  C  ──pop──>  D
                       B
                  bottom  A

    (Initial state)      (After pop)
```

The diagram shows:
- A stack with elements A (bottom), B, C, and D (top)
- A **push** operation adding element D to the top
- A **pop** operation removing element D and returning it
- The remaining stack showing elements C, B, and A