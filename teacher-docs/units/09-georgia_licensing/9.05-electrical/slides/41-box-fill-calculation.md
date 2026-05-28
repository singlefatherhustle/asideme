# Box Fill Calculation — Worked Examples

## The 5-step process

```
1. Count conductors (each pass-through = 1)
2. Count EGCs separately (all = 1 unit only)
3. Count internal clamps (all = 1 unit only)
4. Count device straps (each = 2 units)
5. Sum all × conductor volume from Table 314.16(B)
6. Compare to box volume from Table 314.16(A)
```

## Example 1 — Simple receptacle box

```
Single-gang box with:
- 1 NM 14/2 cable in
- 1 NM 14/2 cable out
- 1 duplex receptacle
- Internal cable clamps

Conductors:        4 hot/neutral × 2.0 ci = 8.0
EGCs:              1 × 2.0 = 2.0
Clamps:            1 × 2.0 = 2.0
Device strap:      2 × 2.0 = 4.0
                                    ─────
Total:                              16.0 ci

Need: ≥ 16 ci box (or marked plastic 16+ ci)
```

## Example 2 — 3-way switch in a multi-gang

```
2-gang box with:
- 1 NM 14/2 cable in (power)
- 1 NM 14/3 cable to traveler partner (3-way)
- 1 NM 14/2 cable to lighting load
- 2 single-pole / 3-way switches on a 2-gang strap
- Internal clamps

Power cable conductors: 1 hot + 1 neutral + 1 EGC
Traveler cable: 1 hot + 2 travelers + 1 EGC
Load cable: 1 hot (switched) + 1 neutral + 1 EGC

Total conductors (counted individually):
   Hot:        3 × #14 = 6.0 ci
   Neutral:    2 × #14 = 4.0 ci
   Travelers:  2 × #14 = 4.0 ci
                              ─────
                              14.0 ci

EGCs: 1 × #14 = 2.0 ci (all counted as one)
Clamps: 1 × #14 = 2.0 ci
Device straps: 2 straps × 2 × #14 = 8.0 ci
                                   ─────
Total:                             26.0 ci

Need: ≥ 26 ci box
   → 4-11/16" sq × 1-1/2" (29.5 ci) works
```

## Example 3 — Junction box (no devices)

```
4" square × 1-1/2" box (21 ci) with:
- 2 NM 12/2 cables joining (splice)
- 1 internal clamp set

Conductors: 4 × #12 = 4 × 2.25 = 9.0 ci
EGCs:       1 × #12 = 2.25 ci
Clamps:     1 × #12 = 2.25 ci
                              ─────
Total:                        13.5 ci

21 ci box has plenty of room. Junction box OK.
```

## Watch the conductor SIZE going in

Different sizes count at different volumes. If a box has a mix:

```
1 NM 12/2 (4 × #12 = 9.0)
1 NM 14/2 (4 × #14 = 8.0)
                      ─────
                       17.0 ci (just for the conductors)

Add EGC at largest size in box: 1 × #12 = 2.25
```

The EGC counts at the **largest** conductor size present in the box, even if you only have one #12 EGC.

## Common errors recap

- Miscounting EGCs (count once)
- Miscounting clamps (count once)
- Using the wrong conductor size for EGC volume
- Forgetting that device straps count as 2 (not 1)
- Using a too-shallow box "because the wires fit"
