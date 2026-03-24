# Bubble Sort

- $O(n)$ to bubble 1 element to the end
- We need to bubble n elements to the end
- SO the overall time complexity is $O(n*n) = O(n^2)$

# Binary Search

- ONLY works on a sorted array

binary search(arr, target):

- while we can split the array in half:
  - look at the middle of the array & throw out either the left half or the right half
  - OR we've found our target

Worst case scenario:

- we need to keep cutting the array in half until we can't
- how many times is that: $log_2(n)$

time complexity: $O(log n)$
