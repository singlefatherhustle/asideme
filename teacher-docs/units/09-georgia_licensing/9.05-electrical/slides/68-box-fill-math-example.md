# Box Fill — Math Example (Multi-Gang Switch Box)

## The scenario

3-gang plastic box. Contents:

- 1 NM 14/2 cable bringing power in
- 1 NM 14/3 cable to a 3-way switch in another room (traveler partner)
- 1 NM 14/2 cable to a switched light (load 1)
- 1 NM 14/2 cable to a switched outlet (load 2)
- 1 NM 14/2 cable to a switched ceiling fan (load 3)
- 3 switches (single-pole, 3-way, single-pole) on a 3-gang strap

## Step 1 — Count conductors

```
Power in:        1 hot + 1 neutral + 1 EGC
3-way traveler:  1 common + 2 travelers + 1 EGC
Load 1 (light):  1 switched hot + 1 neutral + 1 EGC
Load 2 (recep):  1 switched hot + 1 neutral + 1 EGC
Load 3 (fan):    1 switched hot + 1 neutral + 1 EGC
```

**Total individual conductors:**

```
Hots (incl. switched):     5  (in + traveler common + 3 load hots)
Travelers:                 2
Neutrals:                  4
                          ───
Total non-EGC:            11
EGCs:                      5 (all same size #14)
```

## Step 2 — Apply box fill rules

| Item | Volume (#14 = 2.0 ci) |
|---|---|
| 11 non-EGC conductors | 11 × 2.0 = 22.0 ci |
| EGCs (all counted as one) | 1 × 2.0 = 2.0 ci |
| Internal cable clamps (if NM has them, count once) | 1 × 2.0 = 2.0 ci |
| Device straps (3 switches on 3-gang) | 3 straps × 2 × 2.0 = 12.0 ci |

**Total volume needed: 22 + 2 + 2 + 12 = 38.0 ci**

## Step 3 — Pick a box

Standard plastic 3-gang boxes typically have these volumes (verify on actual product):

- 3-gang 3" deep cut-in: ~24-30 ci → TOO SMALL
- 3-gang 3" deep new-work: ~36-42 ci → MARGINAL or OK
- 3-gang 3-3/4" deep: ~44-50 ci → ENOUGH ✓

Always check the volume stamped or marked on the box itself.

## Step 4 — What if it doesn't fit?

Options if a single box is too small:

```
1. Use a deeper box (most common fix)
2. Use a metal box with a mud ring extender
3. Split the load — use a junction box upstream to handle some of the connections
   and run fewer cables to the switch box
4. Use a "bottomless" box stack with extension ring
```

## Step 5 — Common error in this kind of problem

This is a frequent exam question. Candidates often:

```
1. Count each EGC as a separate item     ← WRONG. All EGCs in box = 1 unit.
2. Forget that switches are 2 conductors each ← WRONG. Each strap = 2 units (regardless of switch type).
3. Skip cable clamps  ← if internal clamps are present, count once.
4. Use the wrong conductor size for EGC volume ← use the largest size in the box for ALL EGCs.
```

## Real-world signal

In the field, the 3-gang box scenario almost always justifies a deeper box. Plan for it during rough-in rather than discovering the problem when devices won't fit.
