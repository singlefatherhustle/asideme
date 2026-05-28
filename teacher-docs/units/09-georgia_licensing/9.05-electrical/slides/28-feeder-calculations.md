# Feeder Calculations (NEC 220 Part III)

## What a feeder is

A feeder is the conductor between the **service equipment** and the **final branch-circuit OCPD**. In a panel hierarchy:

```
Service ── Feeder ── Subpanel ── Branch circuit ── Outlet
```

The feeder must carry the combined load of all branches it serves, with demand factors applied.

## Demand factor concept

Demand factors recognize that not all loads operate at maximum at the same time.

```
Connected load × Demand factor = Calculated load
```

Example: a dwelling unit has 7,200 VA general lighting, but the 220.42 table allows demand factors:

| First 3,000 VA | 100% |
|---|---|
| Next 117,000 VA | 35% |
| Remainder over 120,000 VA | 25% |

For 7,200 VA:
```
First 3,000 @ 100% = 3,000 VA
Remaining 4,200 @ 35% = 1,470 VA
Total demand = 4,470 VA
```

## Cooking appliance demand — Table 220.55

Common dwelling unit calculation:

| Range nameplate | Demand |
|---|---|
| 1 range ≤ 12 kW | 8 kW |
| 1 range > 12 kW | 8 kW + 5% per kW over 12 |
| 2 ranges ≤ 12 kW each | 11 kW |
| 3 ranges ≤ 12 kW each | 14 kW |

A 12 kW range is calculated as 8 kW for service / feeder sizing.

## Optional method for dwelling — 220.82

For a one-family dwelling, optional calculation uses two terms:

```
First 10 kVA of total load @ 100%
Remainder of total load @ 40%
+ Largest of: AC, heat, or 100% of either
```

The optional method usually gives a smaller required service than the standard method. Both are valid; use whichever fits better.

## Sample dwelling feeder calc (standard method)

```
General lighting (2,400 sqft × 3 VA):           7,200 VA
Small appliance (2 × 1,500 VA):                 3,000 VA
Laundry circuit (1 × 1,500 VA):                 1,500 VA
                                              ────────────
Subtotal:                                      11,700 VA

Apply demand:
  First 3,000 @ 100%:        3,000 VA
  Next 8,700 @ 35%:          3,045 VA
                           ────────────
                              6,045 VA

Add appliances at nameplate:
  Range (12 kW → 8 kW demand):  8,000 VA
  Water heater (4,500 VA @ 100%): 4,500 VA
  Dryer (5,500 VA @ 100%):       5,500 VA
                              ────────────
Total demand:                  24,045 VA

Service ampacity = 24,045 / 240 V = 100.2 A → 100 A service minimum
```

A 100 A service is sufficient. For builder-grade, builders often install 200 A anyway for headroom.
