# What is a hash function?

## Definition

A **hash function** is a function that can map input to some fixed output.

## Cryptographic Hash Functions

The goal of a **cryptographic** hash function is to make it extremely **difficult** to reverse-engineer the input when given an output.

It's easy to get the **hash** when you know the input, but difficult to get the input when you know the hash.

## Diagram: Hash Function Flow

```
password     →  abcde
p@ssword     →  xy72z
cantr1p      →  8yhj1
```

**Direction:**
- **Easy** (left to right): Input → Hash output
- **Difficult** (right to left): Hash output → Input

---

*All content is proprietary and confidential.*

Page 7