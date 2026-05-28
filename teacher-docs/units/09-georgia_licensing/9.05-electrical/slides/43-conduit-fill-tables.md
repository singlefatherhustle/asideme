# Conduit Fill — Chapter 9 Tables

## The fill percentages

NEC Chapter 9, Table 1 sets maximum cross-sectional area conductors may occupy in a conduit:

| Number of conductors | Maximum fill % |
|---|---|
| 1 conductor | 53% |
| 2 conductors | 31% |
| 3 or more conductors | **40%** |

The 40% number is the most commonly used because most installs have 3+ conductors.

## Why these specific numbers?

- 1 conductor: 53% allows for easy single-cable pulls without binding
- 2 conductors: 31% accounts for the fact that two round objects can't pack tightly
- 3+ conductors: 40% is the standard "engineered" value for general work

## The two tables you need

Use **Table 4** (Dimensions and Percent Area of Conduit) → tells you the cross-sectional area of a raceway at each fill level.

Use **Table 5** (Dimensions of Insulated Conductors) → tells you the area of each conductor.

## Step-by-step fill calculation

```
1. Identify each conductor's cross-sectional area (Table 5)
2. Sum the areas of all conductors
3. Match to Table 4 for the chosen raceway type, at 40% fill
```

## Example: How many #12 THHN fit in 1/2" EMT?

```
From Table 5:
   #12 THHN area = 0.0133 sq in per conductor

From Table 4 (EMT, 1/2"):
   40% fill = 0.122 sq in available

Max #12 THHN in 1/2" EMT:
   0.122 / 0.0133 = 9.17
   → 9 conductors max
```

## Example: Mixed conductors in 3/4" EMT

```
Run contains:
- 3 × #10 THHN  → 3 × 0.0211 = 0.0633 sq in
- 4 × #12 THHN  → 4 × 0.0133 = 0.0532 sq in
- 1 × #10 THHN (EGC) → 0.0211 sq in
                                ─────────
Total area:                     0.1376 sq in

From Table 4 (EMT, 3/4"):
   40% fill = 0.213 sq in available

0.1376 < 0.213 ✓ FITS
```

## Quick-reference table (THHN in EMT @ 40% fill)

| Trade size EMT | #14 THHN | #12 THHN | #10 THHN | #8 THHN |
|---|---|---|---|---|
| 1/2" | 12 | 9 | 5 | 3 |
| 3/4" | 22 | 16 | 10 | 6 |
| 1" | 35 | 26 | 16 | 9 |
| 1-1/4" | 60 | 43 | 27 | 16 |
| 1-1/2" | 81 | 58 | 36 | 22 |
| 2" | 132 | 96 | 60 | 36 |

## Common conduit-fill errors

- Using % of inside diameter instead of cross-sectional area
- Mixing the 1-conductor table with the 3+ table
- Not de-rating for ambient temperature separately (fill ≠ ampacity)
- Forgetting that the EGC counts as a conductor for fill purposes

Conductor fill controls how many physical conductors fit. **Separately**, ampacity adjustment (Table 310.15(C)(1)) controls how much current those conductors can carry when bundled.
