# Why does time complexity matter?

Imagine that you are managing the inventory of a commercial warehouse with 10,000 different items. You write an algorithm to check if something is in stock.

| Big O | # of operations |
|-------|-----------------|
| O(1) | 1 |
| O(log(n)) | ~13 |
| O(n) | 10,000 |
| O(n²) | 100,000,000 |
| O(n³) | 1,000,000,000,000 |

This is just for 10,000 items, but organizations often work with much larger datasets!

---

*All content is proprietary and confidential.*