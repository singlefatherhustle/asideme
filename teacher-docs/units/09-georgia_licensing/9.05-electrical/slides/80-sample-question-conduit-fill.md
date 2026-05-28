# Sample Exam Question — Conduit Fill

## The question

> Six (6) #10 THHN conductors plus one (1) #10 THHN equipment grounding conductor must be installed in EMT raceway. What is the minimum trade-size EMT that may be used?

**Answer choices:**

```
A) 1/2"
B) 3/4"
C) 1"
D) 1-1/4"
```

## Step-by-step solution

### Identify conductor area (Table 5)

```
#10 THHN: 0.0211 sq in each
```

### Total area for all conductors

```
Total conductors: 6 + 1 = 7 (the EGC counts for fill purposes)
Total area: 7 × 0.0211 = 0.1477 sq in
```

### Apply the correct fill % (3+ conductors → 40%)

We need a raceway with at least 0.1477 sq in available at 40% fill.

### Check Table 4 — EMT at 40% fill

| EMT trade size | 40% fill area |
|---|---|
| 1/2" | 0.122 sq in |
| 3/4" | 0.213 sq in |
| 1" | 0.346 sq in |
| 1-1/4" | 0.598 sq in |

`0.1477 > 0.122` → 1/2" doesn't work
`0.1477 < 0.213` → 3/4" works ✓

**Answer: B) 3/4"**

## Common wrong answers and why

**A) 1/2"**: incorrect because the cross-sectional area (0.1477) exceeds the 40% fill area of 1/2" EMT (0.122). The conductors won't fit per the table.

**C) 1"**: would work but it's not the *minimum* trade size. The question asks for minimum, not "any acceptable size."

**D) 1-1/4"**: even more oversized.

## Tricky variant

The question could be reworded:

> Six #10 THHN current-carrying conductors plus one #10 THHN EGC in EMT — also accounting for ampacity adjustment, what is the minimum size?

In that case:

- Fill says 3/4" works ✓
- BUT ampacity adjustment (6 CCC) means 80% derating per Table 310.15(C)(1)
- #10 THHN at 75°C = 35 A, derated to 28 A
- If breaker is 30 A: 28 A < 30 A → conductor is not adequately protected
- Must either reduce CCC count or upsize wire to #8 or #6

This shows up as a multi-part question. Fill alone says 3/4". Ampacity alone might dictate larger wire.

## Other "minimum trade size" patterns

Memorize key reference points:

| Wire size + count | Quick min EMT |
|---|---|
| 3 × #12 THHN | 1/2" |
| 4 × #12 THHN + EGC | 1/2" |
| 6 × #12 THHN + EGC | 3/4" |
| 3 × #10 THHN | 1/2" |
| 7 × #10 THHN | 3/4" |
| 3 × #6 THHN + EGC | 1" |
| 3 × #4 THHN + EGC | 1" |
| 3 × #2 THHN + EGC | 1-1/4" |

When in doubt, use the conduit-fill section of Ugly's — pre-calculated tables.
