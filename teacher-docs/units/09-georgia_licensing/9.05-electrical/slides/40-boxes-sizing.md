# Boxes — Sizing (NEC Article 314)

## Why box sizing matters

Boxes must have enough volume to hold:

- Conductors entering / leaving
- Devices (switches, receptacles)
- Cable clamps
- Splices
- Equipment grounding conductors

Undersized boxes overheat conductors, damage insulation, and fail inspection.

## Box volume — Table 314.16(A)

Common box volumes (cubic inches):

| Box | Volume |
|---|---|
| 4" square × 1-1/4" deep | 18.0 ci |
| 4" square × 1-1/2" deep | 21.0 ci |
| 4" square × 2-1/8" deep | 30.3 ci |
| 4-11/16" sq × 1-1/4" | 25.5 ci |
| 4-11/16" sq × 1-1/2" | 29.5 ci |
| 4-11/16" sq × 2-1/8" | 42.0 ci |
| Single-gang plastic | varies (marked) |
| 1-gang × 2" deep | 12.5 ci |
| Octagon (round) various | 12.5 - 21.5 ci |

Plastic and pre-made boxes have the volume stamped or labeled on them.

## Conductor volume — Table 314.16(B)

Each conductor counts as a volume per its size:

| Conductor size | Volume each |
|---|---|
| #18 | 1.5 ci |
| #16 | 1.75 ci |
| **#14** | **2.0 ci** |
| **#12** | **2.25 ci** |
| **#10** | **2.5 ci** |
| #8 | 3.0 ci |
| #6 | 5.0 ci |

## How to count conductors

For each item in the box:

| Item | Count |
|---|---|
| Each conductor passing through (or terminated) | 1 |
| Conductor running through without splice | 1 (still counts once) |
| Conductor entering and exiting through different KOs | 1 |
| All EGCs of same size | 1 (only one is counted for all EGCs in the box) |
| All cable clamps internal | 1 (regardless of how many clamps) |
| Each device strap (switch, receptacle) | 2 (counted as 2 conductors of largest size connected) |
| Each fitting (yoke for support, raised cover) | 1 each |

## Worked example

```
Box contains:
- 2 NM 14/2 cables (2 hot, 2 neutral, 2 EGC)
- 1 duplex receptacle
- 1 cable clamp (internal)

Conductors:        4 × #14 = 4 × 2.0 = 8.0 ci
EGCs:              1 × #14 = 2.0 ci  (all EGCs counted as one)
Cable clamps:      1 × #14 = 2.0 ci  (all clamps counted as one)
Device strap:      2 × #14 = 4.0 ci  (2 × largest size on strap)
                                  ─────────
Total volume needed:              16.0 ci

Required: 16 ci → 4" square × 1-1/4" (18 ci) works.
```

## Common errors

- Counting each EGC separately (only count once for all)
- Counting each cable clamp (only count once for all internal clamps)
- Missing the device strap (× 2)
- Using a plastic box's listed cu-in WITHOUT noting that pigtails count
- Inverting the size scale (smaller conductor = smaller volume, not bigger)
