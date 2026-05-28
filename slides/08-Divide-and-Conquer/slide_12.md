# Split the array

In the first phase, we split the array until we reach arrays of at most 1 element, which is our base case. An array with 0 or 1 elements is sorted!

## Diagram: Array Splitting Process

**Initial array:**
```
[3, 9, 89, -56, 92, 57, 13, 40]
```

**First split (divide into 2):**
```
[3, 9, 89, -56] | [92, 57, 13, 40]
```

**Second split (divide into 4):**
```
[3, 9] | [89, -56] | [92, 57] | [13, 40]
```

**Third split (divide into 8 - base case reached):**
```
[3] | [9] | [89] | [-56] | [92] | [57] | [13] | [40]
```

---

*All content is proprietary and confidential.*