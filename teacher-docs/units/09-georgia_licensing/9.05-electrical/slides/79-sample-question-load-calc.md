# Sample Exam Question — Load Calculation

## The question

> A 2,400 sq ft single-family dwelling has the following loads:
> - General lighting (calculated per Table 220.42)
> - 2 small-appliance circuits @ 1,500 VA each
> - 1 laundry circuit @ 1,500 VA
> - 12 kW electric range
> - 5,500 W electric dryer
> - 4,500 W electric water heater
>
> Using the **standard calculation method**, what is the minimum service ampacity for a single-phase 240V service?

**Answer choices:**

```
A) 100 A
B) 125 A
C) 150 A
D) 200 A
```

## Step-by-step solution

### Lighting + small-appliance + laundry

```
General lighting:  2,400 × 3 VA       = 7,200 VA
Small appliance:   2 × 1,500 VA       = 3,000 VA
Laundry:           1 × 1,500 VA       = 1,500 VA
                                       ────────
Subtotal:                             11,700 VA
```

### Apply demand factor (Table 220.42)

```
First 3,000 @ 100%:    3,000 VA
Next 8,700 @ 35%:      3,045 VA
                       ────────
Result:                6,045 VA
```

### Range (Table 220.55)

```
12 kW range → demand: 8,000 VA
```

### Dryer (Table 220.54)

```
5,500 W dryer → 5,500 VA  (minimum 5,500)
```

### Water heater (≥ 500 VA fixed appliance)

```
4,500 VA  (only one fixed appliance, so 100% — no 75% factor)
```

### Total demand

```
Lighting demand:       6,045 VA
Range:                 8,000 VA
Dryer:                 5,500 VA
Water heater:          4,500 VA
                       ────────
Total:                24,045 VA

Service amps = 24,045 / 240 = 100.2 A
```

### Choose service size

```
100.2 A → next standard size: 100 A is exactly at the calculated value.
NEC requires the service to be at least the calculated load, AND
service rating must be ≥ calculated load.
```

Since the calculation lands at 100.2 A and a 100 A service is rated for 100 A:

**Answer: B) 125 A** is the smallest standard service that exceeds 100.2 A.

(A 100 A service would technically equal the calc but provides zero margin; per practical interpretation and most code authorities, next size up.)

## Why this question is hard

The candidate must:

1. Remember the unit-load multiplier (3 VA/sqft for dwelling)
2. Apply the demand factor correctly (first 3000 + 35% remainder)
3. Use the range table (12 kW → 8 kW demand)
4. Use dryer table (1 dryer = nameplate min 5,500 VA)
5. Apply 100% to fixed appliance when only one
6. Divide by 240 V (not 120 V)
7. Round up to standard size

Miss any one step and the answer changes by 20-30 A.

## Key takeaway

The standard load calc is mechanical but unforgiving. Always:

- Subtotal lighting + small-appl + laundry first
- THEN apply demand factor
- THEN add appliances/range/dryer at the appropriate demand
- THEN divide by service voltage
