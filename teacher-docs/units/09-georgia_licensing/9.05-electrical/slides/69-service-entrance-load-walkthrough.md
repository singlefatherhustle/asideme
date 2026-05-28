# Service Entrance Load — Full Walkthrough

## The dwelling

A 3,200 sqft single-family home with:

- Standard general lighting
- 12 kW range
- 4.5 kW water heater (240 V)
- 5.5 kW dryer (240 V)
- 1.2 kW dishwasher (120 V)
- 0.9 kW disposal (120 V)
- 1.4 kW microwave (120 V)
- 5-ton AC (24,000 BTU/hr, 240 V, ~5.0 kW running)
- 10 kW electric heat (240 V)
- 60 A subpanel for garage/workshop

## Step 1 — Lighting + small-appliance + laundry

```
Lighting:    3,200 × 3 VA       = 9,600 VA
2 small appl:  2 × 1,500 VA     = 3,000 VA
1 laundry:     1 × 1,500 VA     = 1,500 VA
                                 ────────
Subtotal:                       14,100 VA
```

## Step 2 — Apply demand factor

```
First 3,000 @ 100%:    3,000 VA
Next 11,100 @ 35%:     3,885 VA
                       ────────
Step 2 total:          6,885 VA
```

## Step 3 — Fixed appliances ≥ 1/4 HP or ≥ 500 VA

```
Water heater (4,500 VA):      4,500 VA
Dishwasher (1,200 VA):        1,200 VA
Disposal (900 VA):              900 VA
Microwave (1,400 VA):         1,400 VA
                              ────────
Sub:                          8,000 VA

4+ fixed appliances → 75% demand factor:
8,000 × 0.75 = 6,000 VA
```

## Step 4 — Range (Table 220.55)

```
12 kW range → demand: 8,000 VA
```

## Step 5 — Dryer (Table 220.54)

```
5,500 VA dryer @ 5,500 VA (not less than 5,500)
                    = 5,500 VA
```

## Step 6 — Heat or AC (whichever is larger)

```
AC (running ~5,000 VA at 240 V): 5,000 VA
Electric heat (10,000 VA):       10,000 VA  ← larger
```

Use heat: 10,000 VA.

## Step 7 — Garage subpanel (60 A × 240 V)

```
60 A × 240 V = 14,400 VA (treat at nameplate / required)
```

For an unfinished subpanel, NEC allows the actual calculated load of the loads it serves, but conservatively, use rated capacity.

## Step 8 — Total

```
Step 2 (lighting demand):       6,885 VA
Step 3 (fixed appliances):      6,000 VA
Step 4 (range):                 8,000 VA
Step 5 (dryer):                 5,500 VA
Step 6 (heat):                 10,000 VA
Step 7 (garage panel):         14,400 VA
                              ────────
Total demand:                  50,785 VA
```

## Step 9 — Service ampacity

```
A = 50,785 / 240 V = 212 A

Next standard service size: 225 A (panel-level) → typically install 200 A or 250 A panel
```

A 200 A service is undersized by ~12 A here. The right answer is:

- 225 A panel (rare), or
- 250 A panel (closer next size up), or
- Re-do the load calc using the **optional method** which often shows a smaller required service

## Step 10 — Optional method comparison

The optional dwelling method (220.82) for a 200 A or larger service:

```
First 10 kVA: 100%
Remaining: 40%
+ Largest of: AC, heating
```

```
Lighting + small-appl + laundry: 14,100
Fixed appliances + range + dryer at nameplate: ~22,000
Heat (10,000) - replaces the next-step
                                ─────────
Items to sum first:              36,100

First 10,000 @ 100%:             10,000
Remainder 26,100 @ 40%:          10,440
                                ─────────
Subtotal:                        20,440

+ Largest: heat (10,000)        +10,000
                                ─────────
Total demand:                    30,440 VA

Service A = 30,440 / 240 = 127 A
```

**The optional method gives 127 A** — well within a 150 A or 200 A panel. The standard method gave 212 A. Both are legal; use whichever matches your situation better.

A 200 A service comfortably handles this home using the optional method.
