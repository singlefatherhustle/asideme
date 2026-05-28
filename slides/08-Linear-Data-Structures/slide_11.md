# Array implementation

We can still use an array to store the data. Once we hit the array's capacity, we can make a new bigger array and copy the original data over.

- O(1) to access something from the middle of the array
- O(n) to add something to the list because we might have to copy the array

## Memory Diagram

The diagram shows the process of array expansion:

1. **Initial state**: An array in memory containing elements A, B, C, D with allocated capacity shown in light red
2. **Expansion process**: When capacity is exceeded, a new larger array is created
3. **Copy operation**: Elements A, B, C, D are copied from the original array (shown with arrows) to the new larger array
4. **New element**: Element E is added to the expanded array
5. **Final state**: The array now occupies a larger memory allocation (shown in light red) with capacity for more elements

---

*All content is proprietary and confidential.*

**Page 9**