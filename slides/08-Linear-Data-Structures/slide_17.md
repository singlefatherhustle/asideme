# Queues

A **queue** is a *list* with **FIFO (First-In, First-Out)** access.
We are only allowed to **enqueue** (add) to the **back** and **dequeue** (remove) from the **front**.

## Trade-offs: Array vs Linked List Implementation

What are the trade-offs between using an array vs a linked list to implement a queue?

### Diagram

```
                front                          back
                  |                              |
                  v                              v
              +-------+-------+-------+
              |   B   |   C   |   D   |
              +-------+-------+-------+
                  ^                              ^
              dequeue                        enqueue
              
                  |                              |
                  v                              v
              +-------+                      +-------+
              |   A   |                      |   E   |
              +-------+                      +-------+
              
                        queue
```

---

*All content is proprietary and confidential.*

Page 15