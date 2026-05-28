# Service Load Calculation — Dwelling Unit

## Service vs feeder

The service is what brings power INTO the building from the utility. Feeder distributes within. The service load calculation determines the minimum service ampacity.

## Standard calculation steps

```
1. Calculate general lighting + small-appliance + laundry loads
2. Apply demand factor (220.42)
3. Add all 240 V (or larger) appliances at nameplate, with their demand factor
4. Add the largest of: heating, cooling (not both)
5. Total demand → divide by 240 V → minimum service ampacity
```

## Worked example: 2,400 sqft dwelling

### Step 1 — Lighting + small appliance + laundry

```
Lighting:        2,400 × 3 VA       = 7,200 VA
2 small appl:    2 × 1,500 VA       = 3,000 VA
1 laundry:       1 × 1,500 VA       = 1,500 VA
                                      ──────────
Subtotal:                            11,700 VA
```

### Step 2 — Demand factor

```
First 3,000 VA @ 100%:    3,000 VA
Next 8,700 VA @ 35%:      3,045 VA
                          ──────────
Step 2 total:             6,045 VA
```

### Step 3 — Fixed appliances (each ≥ 1/4 HP or ≥ 500 VA)

```
Water heater (4,500 VA):       4,500 VA
Dishwasher (1,200 VA):         1,200 VA
Disposal (900 VA):               900 VA
Microwave (1,400 VA):          1,400 VA
                              ──────────
Sub:                           8,000 VA

If 4+ fixed appliances: 75% demand factor allowed
8,000 × 0.75 = 6,000 VA
```

### Step 4 — Range (Table 220.55)

```
12 kW range → demand: 8,000 VA
```

### Step 5 — Dryer (Table 220.54)

```
1 dryer @ 5,500 VA = 5,500 VA (min) — use nameplate or 5,500, whichever is greater
```

### Step 6 — Heat or AC (whichever is larger)

```
Central AC: 4,800 VA (running)
Electric heat (10 kW): 10,000 VA
Heat is larger → use 10,000 VA
```

### Step 7 — Total

```
Step 2 (lighting demand):   6,045 VA
Step 3 (fixed appliances):  6,000 VA
Step 4 (range):             8,000 VA
Step 5 (dryer):             5,500 VA
Step 6 (heat):             10,000 VA
                          ──────────
Total demand:              35,545 VA

Service A = 35,545 / 240 = 148 A → 150 A or 200 A service
```

A 200 A service is the practical pick (next standard size, gives headroom).

## Common errors

- Adding both heating AND cooling (only the larger)
- Forgetting the 75% demand factor for 4+ fixed appliances
- Using range nameplate instead of Table 220.55 demand
- Dividing by 120 V instead of 240 V on a single-phase service
