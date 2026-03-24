# Algorithms

An **algorithm** is an explicit, precise, unambiguous, mechanically-executable sequence of elementary instructions.

This is just a fancy way to say **function**.

## Strategy

1. Do you know what the problem is asking? Can you rephrase it as a function with input and output?
2. Have you written a _similar_ function in the past?
3. If not, what _strategies_ can you use to tackle this problem?
4. Write / design the algorithm.
5. Analyze the algorithm.

# Algorithm Analysis

We think about algorithms in terms of **time** and **space** complexity.

**time complexity** = how fast is the algorithm
**space complexity** = how much memory does it use

Currently, time matters more b/c memory is relative cheap.

## Runtime

How would you measure "speed"?

- lines of code
  - way overrated & don't prioritize this ever
  - this saves space at the cost of legibility
- number of seconds
  - OK if run on the same computer
    - be careful about background processes
  - different machines have different power

- number of operations
  - read memory
  - move to a different address
  - write to memory

  - this is extremely annoying & tedious to actually calculate

## Big O

We use $O$ notation (read as "big O") to denote the **asymptotic upper bound** for a functions' runtime. In other words, a function's **worst-case** scenario.

x axis = size of the input
y axis = runtime (# of operations)

Imagine this function:

```js
function foo(arr) {
  const var1 = 1;
  const var2 = 2;
  const var3 = 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[j]);
    }
  }
}
```

We would say the runtime is approximately `3x + 5`,
where `x` is the length of the input array.

Big O says that as long as there is A point anywhere where the runtime of fn A becomes faster, then we say fn A is just faster.

Given a polynomial runtime, we can drop all lower order terms and all coefficients.
$pn^3 + qn^2 + rn + s$, we can just drop everything and say it's $O(n^3)$, read as "the function is order n cubed" or "the function is big O n cubed".

We can summarize the relative ordering as follows:

> $1 < \log n < n < n \log n < n^2 < n^3 ... < 2^n < 3^n < n!$

| Big O       | Common Name |
| ----------- | ----------- |
| $O(1)$      | constant    |
| $O(\log n)$ | logarithmic |
| $O(n)$      | linear      |
| $O(n^2)$    | quadratic   |
| $O(n^3)$    | cubic       |
| $O(2^n)$    | exponential |
| $O(n!)$     | factorial   |

```js
function foo(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr.map(xyz);
  }
}

// arr.map() is still O(n) so this is O(n^2)
```

Super barebones heuristic:

- No loop = $O(1)$
- 1 loop / array = $O(n)$
- Nested loop / 2D array = $O(n^2)$

## Space complexity

How many _new_ variables are we creating?

x axis = size of input
y axis = units of memory

- 1 new variable = 1 "unit" of memory
- I copy the input array = $O(n)$ memory use
