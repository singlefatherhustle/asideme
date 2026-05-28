# Conduit Fill — Math Example (Mixed Conductors)

## The scenario

A new commercial branch run needs:

- 3 × #12 THHN (hots: phases A, B, C)
- 1 × #12 THHN (neutral, shared)
- 1 × #12 THHN (equipment grounding conductor)
- 2 × #10 THHN (240 V dedicated circuit on same run)
- 1 × #10 THHN (EGC for the 240 V circuit)

Question: minimum trade-size EMT?

## Step 1 — Find conductor areas (Table 5)

```
#12 THHN: 0.0133 sq in each
#10 THHN: 0.0211 sq in each
```

## Step 2 — Total area

```
#12 conductors (5 total):  5 × 0.0133 = 0.0665 sq in
#10 conductors (3 total):  3 × 0.0211 = 0.0633 sq in
                                       ─────────
Total area:                            0.1298 sq in
```

## Step 3 — Apply 40% fill (3+ conductors)

Available area at 40% fill from Table 4:

| EMT size | 40% area |
|---|---|
| 1/2" | 0.122 sq in |
| 3/4" | 0.213 sq in |
| 1" | 0.346 sq in |

`0.1298 > 0.122` → 1/2" doesn't work
`0.1298 < 0.213` → 3/4" works ✓

## Step 4 — Check ampacity adjustment

Count current-carrying conductors (CCCs):

- 3 phase conductors (hot): always CCC
- Shared neutral: CCC if balanced load is line-to-line, NOT CCC if line-to-neutral
- EGC: never CCC
- 240 V hots: both CCC
- 240 V EGC: not CCC

```
CCC total: 3 (3Ø hots) + 2 (240 V hots) = 5 CCC
```

Ampacity adjustment per Table 310.15(C)(1):

| CCC | Factor |
|---|---|
| 4-6 | 80% |
| 7-9 | 70% |
| 10-20 | 50% |

For 5 CCCs: 80% factor.

```
#12 THHN base ampacity (75°C) = 25 A
   With 80% derating: 25 × 0.80 = 20 A
   → still satisfies 20 A breaker rating ✓
```

## Step 5 — Confirm answer

```
Minimum EMT trade size: 3/4"
   ampacity-adjusted #12 THHN supports up to 20 A circuits ✓
```

## What if we exceeded 9 CCCs?

If the run had, say, 10 CCC conductors (more circuits), then:

```
#12 THHN derated: 25 × 0.50 = 12.5 A
   → no longer supports a 20 A breaker
   → must upsize wire to #10 or split into separate conduits
```

This is why bundling many circuits in one conduit is often impractical even when the fill math works — derating gets you.

## Common mixed-conductor errors

- Counting EGC as a CCC (it's not)
- Not applying ampacity adjustment when total CCCs exceed 3
- Forgetting that a shared neutral on 3Ø Wye where loads are line-to-neutral DOES carry current and IS a CCC
- Using 1/0 area for #1 (different conductor sizes have noticeably different areas)
