# Hash table

## Definition

A **map** is an ADT where we store and access key-value pairs. Think JavaScript object!

Maps can be implemented by a **hash table**, which is an array that passes a key through a *hash function* to calculate the *index* where the corresponding value is stored.

## Diagram: Hash Table Structure

```
Keys:          Hash Function:        Index:    Value:
A     ┐                              0         b
      ├──────────────────────────→   
B     ┤                         ┌──→ 1         c
      ├──────────┐          ┌──┘
C     ┤          └────────→ 2         a
      ├──────────────────────────→
D     ┴──────────────────────────→   18        d
                                     19
```

### Components:
- **key**: Input values (A, B, C, D)
- **hash function**: Processing step (blue shaded area)
- **index**: Array indices (0, 1, 2, ..., 18, 19)
- **value**: Stored values (b, c, a, d)

---

*All content is proprietary and confidential.*

Page 16