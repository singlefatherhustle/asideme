# Demand Factors — When and How

## What "demand factor" is

A demand factor is the ratio of maximum demand to total connected load. It recognizes that not all connected loads operate at maximum simultaneously.

```
Demand factor = Maximum demand / Total connected load
              (always ≤ 1.0)
```

A demand factor of 0.50 means the actual peak is 50% of the connected total.

## Standard NEC demand tables

### General lighting — Table 220.42

| Type | Portion at 100% | Remainder |
|---|---|---|
| Dwelling | First 3,000 VA | Next at 35%, over 120,000 at 25% |
| Hotel | First 20,000 VA | Next at 50%, over 100,000 at 25% |
| Hospital | First 50,000 VA | Over at 20% |
| Office (large) | First 20,000 VA | Over at 50% |

### Range/Cooking — Table 220.55

| Number of ranges (≤ 12 kW) | Demand |
|---|---|
| 1 | 8 kW |
| 2 | 11 kW |
| 3 | 14 kW |
| 4 | 17 kW |
| 5 | 20 kW |
| 6 | 21 kW |
| 7-25 | varies, see table |
| 26 or more | 15 kW + 1 kW per range |

### Dryer — Table 220.54

| Number of dryers | Demand |
|---|---|
| 1-4 | 100% |
| 5-9 | 80% |
| 10-12 | 70% |
| 13-22 | 50% |
| 23 or more | Use table |

Always 100% for the first 4 dryers; the demand only kicks in for larger multi-family.

### Fixed appliances (excluding range/dryer/HVAC) — 220.53

```
≥ 4 fixed appliances on the feeder: 75% demand factor
< 4 fixed appliances: 100%
```

### Receptacles non-dwelling — 220.44

```
First 10 kVA @ 100%
Remainder over 10 kVA @ 50%
```

## Why demand factors exist

In a dwelling with 8 receptacle circuits, you don't draw 8 × 20 A = 160 A at any moment. People don't simultaneously vacuum, microwave, run the washing machine, charge two phones, etc. at maximum capacity.

In a hotel with 200 guest rooms, only a fraction operate lights/TVs simultaneously, and never at full nameplate.

Demand factors capture this statistically so that service sizes don't bloat unnecessarily.

## When NOT to apply demand factor

- Dedicated branch circuits to a single load (size for the load directly)
- Continuous loads (apply 1.25 multiplier instead)
- Motor circuits (use Article 430 sizing instead)
- Service loads for industrial / heavy commercial — actual occupancy load matters more

## Common demand factor errors

- Forgetting to apply demand to the lighting load (taking 100% of all lighting)
- Adding heating + AC instead of using largest only (220.82 optional method)
- Applying multiple demand factors to the same load
- Using a demand factor on dedicated motor circuit
