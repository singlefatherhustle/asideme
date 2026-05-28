# Branch Circuit Calculations (NEC 220 Part II)

## General lighting load — 220.42

Use the unit-load method by occupancy type. NEC Table 220.42:

| Occupancy | VA per ft² |
|---|---|
| Dwelling units | 3 VA |
| Hotels/motels | 2 VA |
| Office buildings | 3.5 VA |
| Restaurants | 2 VA |
| Stores | 3 VA |
| Schools | 3 VA |
| Warehouses | 0.25 VA |
| Industrial commercial loft (Type 1) | 2 VA |

## Worked example — dwelling unit

```
A 2,400 sq ft home:
  General lighting load = 2,400 × 3 = 7,200 VA

Required 15 A and 20 A general-purpose circuits:
  7,200 VA / (120 V × 0.8) = 75 A
  75 A / 15 A = 5 circuits minimum  (or 4 × 20 A)
```

Plus dwelling-required circuits:

- Minimum **2 small-appliance** branch circuits (20 A each) for kitchen, dining, pantry, breakfast area
- Minimum **1 laundry** branch circuit (20 A)
- Minimum **1 bathroom** branch circuit (20 A)

## Continuous vs non-continuous

```
Branch circuit OCPD ≥ Non-continuous load + 1.25 × Continuous load
```

Examples:

```
Non-continuous: 12 A motor (intermittent)
Continuous:     6 A LED lighting (always on)

OCPD required: 12 + (6 × 1.25) = 12 + 7.5 = 19.5 A
Use next standard size: 20 A
```

## Conductor sizing for branch circuits

After OCPD is sized, size conductor to match OR exceed OCPD ampacity:

| OCPD | Min conductor (60°C) | Min conductor (75°C) |
|---|---|---|
| 15 A | #14 Cu | #14 Cu |
| 20 A | #12 Cu | #12 Cu |
| 30 A | #10 Cu | #10 Cu |
| 40 A | #8 Cu | #8 Cu |
| 50 A | #6 Cu | #8 Cu |

## Common branch circuit traps

- Forgetting the 125% rule for continuous loads
- Sizing OCPD to load instead of next standard size up
- Mixing 60°C and 75°C ratings — terminations rated 60°C limit the conductor ampacity even if the conductor itself is rated 90°C
- Using #14 on a 20 A circuit (always #12 minimum for 20 A)
