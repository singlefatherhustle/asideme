# What???

## Definition

**T_a(n) = O(g(n))**

if there exists a positive real number M and a real number n₀ such that

|T_a(n)| ≤ M|g(n)| for all n ≥ n₀

## Explanation

In other words, is there some input size, that once you pass it, you can multiply g(n) by some number M to get it higher than T_a(n)?

If yes, then T_a(n) is big O g(n)!

## Graph

The graph shows two functions plotted on an x-y coordinate system:
- **Blue line**: labeled as c·g(x₀)
- **Red line**: labeled as f(x₀)
- **X-axis**: ranges from 0 to approximately 9
- **Y-axis**: ranges from 0 to approximately 15
- **Marked point**: x₀ is indicated on the x-axis (around x = 5)
- The blue line eventually dominates and stays above the red line after point x₀
- Both functions show oscillating/non-monotonic behavior before x₀
- After x₀, the blue line grows faster and maintains an upper bound over the red line

---

*All content is proprietary and confidential.*

Page 9