# Conduit Fill — Full Worked Example

## The scenario

Run feeds a 60 A subpanel from the main service. Conductors:

```
2 hots         #6 THHN (75°C terminations)
1 neutral      #6 THHN
1 EGC          #10 THHN (sized per Table 250.122 for 60 A)
```

Question: minimum trade-size EMT for this run?

## Step 1 — Areas from Table 5

```
#6 THHN:    0.0507 sq in × 3 = 0.1521 sq in
#10 THHN:   0.0211 sq in × 1 = 0.0211 sq in
                                  ─────────
Total area:                       0.1732 sq in
```

## Step 2 — Required raceway area at 40% fill

```
We need 40% fill area ≥ 0.1732 sq in.
```

## Step 3 — Compare to Table 4 (EMT, 40% fill)

```
EMT 1/2":   40% = 0.122 sq in   → TOO SMALL
EMT 3/4":   40% = 0.213 sq in   → FITS ✓
EMT 1":     40% = 0.346 sq in   → FITS (over-sized)
```

**Answer:** 3/4" EMT is the minimum.

## Step 4 — Verify ampacity adjustment isn't needed

For 3 current-carrying conductors (CCCs) in a raceway, NO derating applies per Table 310.15(C)(1):

```
1-3 CCCs: 100% (no derating)
4-6 CCCs: 80%
7-9 CCCs: 70%
```

In this case, just 3 CCCs (2 hots + 1 neutral in a single-phase system). The neutral DOES count when it's the carrying conductor. EGC does not count as CCC.

Conductor ampacity from Table 310.16, 75°C copper #6 = 65 A. 60 A breaker OK.

## A trap: shared neutral on a multiwire branch

If the same circuit is two-pole sharing a neutral (multiwire branch), the neutral does NOT count as a CCC because it carries only the imbalance:

```
2 hot + 1 shared neutral = 2 CCCs (not 3)
```

This actually allows tighter installs in some configurations.

## A second trap: PV system DC conductors

DC conductors in solar circuits count differently — the negative and positive conductors are both CCCs, and there's no neutral.

```
3-string PV: 3 positives + 3 negatives = 6 CCCs
→ Ampacity adjustment factor = 80%
```

## What changes if we use IMC instead of EMT?

```
IMC 3/4":   40% = 0.235 sq in (slightly larger inside)
```

IMC inside diameter is slightly larger than EMT, so the fill area is slightly more permissive. Same 3/4" trade size, more room. Just makes installation easier, not a different code answer.

## Real-world signal

In planning a run, oversizing one trade size from the calculation is common practice. The cost difference between 3/4" and 1" EMT is small, and the easier pull saves labor.

But the **exam** wants the minimum allowed size, not the practical pick. Pick the smallest size that satisfies the table.
