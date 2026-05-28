# Binary Search

## Main Concept

If we're trying to find something in a *sorted* array, we don't need to look at every element.

By repeatedly comparing our target to the *middle* element, we can disqualify *half* of the search space each time, hence the name **binary search**.

## Time Complexity

The number of comparisons we need to make is the same as the number of times we can divide the array in half. Given an array of size n, we can divide it in half log₂(n) times.

## Visual Example

The diagram shows the binary search process for finding target value 63:

**Step 1:**
- Search space: 1 ... 50 ... 189
- Middle element: 50
- Comparison: 63 > 50, disqualify left half
- Remaining: 50 ... 99 ... 189

**Step 2:**
- Search space: 50 ... 99 ... 189
- Middle element: 99
- Comparison: 63 < 99, disqualify right half
- Remaining: 50 ... 55 ... 99

**Step 3:**
- Search space: 50 ... 55 ... 99
- Middle element: 55
- Comparison: 63 > 55, disqualify left half
- Remaining: 55 ... 63 ... 99

**Step 4:**
- Search space: 55 ... 63 ... 99
- Middle element: 63
- Found target: 63