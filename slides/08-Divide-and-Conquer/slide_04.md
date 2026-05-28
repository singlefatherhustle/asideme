# Bubble Sort

## Description

**Bubble sort** works by "bubbling" each number to its correct position. Every time we see a pair of elements that is out of order, we swap them.

To bubble a number, we potentially have to swap it with every other element in the array.

Given an array of size n, we need to bubble n elements, and it's O(n) to bubble 1 element, so the time complexity of bubble sort is O(n * n) = O(n²).

## Visual Example

The following arrays show the progression of bubble sort on the dataset:

| Step | Array State |
|------|-------------|
| Initial | 3, 9, 89, -56, 92, 57, 13, 40 |
| After pass 1 | 3, 9, -56, 89, 92, 57, 13, 40 |
| After pass 2 | 3, 9, -56, 89, 57, 92, 13, 40 |
| After pass 3 | 3, 9, -56, 89, 57, 13, 92, 40 |
| After pass 4 | 3, 9, -56, 89, 57, 13, 40, 92 |

---

*All content is proprietary and confidential.*