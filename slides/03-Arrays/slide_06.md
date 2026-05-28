# Arrays in Memory

An array variable points to a memory address at which the *first* value is stored. In order to access an element further in the array, we need to move the pointer.

For example, to access the element at index 2, we need to move 2 "spaces" over.

## Memory Layout Diagram

```
numbers
   ↓
memory address    100    101    102    103    104
value              3      2      1      1      0
                    ↑      ↑
                    1      2
```

| memory address | 100 | 101 | 102 | 103 | 104 |
|---|---|---|---|---|---|
| value | 3 | 2 | 1 | 1 | 0 |

The diagram shows:
- Array variable `numbers` points to memory address 100 (the first element)
- Moving 1 space reaches index 1 at address 101 (value: 2)
- Moving 2 spaces reaches index 2 at address 102 (value: 1)

---

*All content is proprietary and confidential.*