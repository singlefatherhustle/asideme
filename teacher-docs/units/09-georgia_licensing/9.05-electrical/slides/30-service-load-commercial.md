# Service Load Calculation — Commercial

## Commercial load is different

Commercial calculations don't use the dwelling-friendly demand tables. The methodology is:

```
1. Sum all loads at their nameplate ratings
2. Apply 220.43 lighting demand factors by occupancy
3. Apply continuous-load adjustment (× 1.25 for OCPD sizing)
4. Add motor loads with proper sizing
5. Add HVAC loads
6. Sum and divide by system voltage
```

## Lighting demand — 220.42

Recall the unit-load table for commercial:

| Occupancy | VA/ft² |
|---|---|
| Office | 3.5 |
| Store / retail | 3 |
| School | 3 |
| Hospital | 2 |
| Restaurant | 2 |
| Warehouse | 0.25 |

Commercial lighting is generally treated as continuous load (× 1.25 for OCPD).

## Receptacle load — 220.44

Non-dwelling general-purpose receptacles:

- Calculate at **180 VA per single or duplex receptacle**
- Total receptacle load gets demand factor:

| First 10 kVA | 100% |
|---|---|
| Remainder over 10 kVA | 50% |

## Worked example: 5,000 sqft retail store

```
Lighting:    5,000 × 3 VA × 1.25 (continuous) = 18,750 VA
Receptacles: 50 receptacles × 180 VA           = 9,000 VA
   First 10,000 @ 100% = 9,000 VA (only have 9,000)
                                                  9,000 VA
Show window: 200 VA/ft × 30 ft × 1.25          = 7,500 VA
HVAC:                                            12,000 VA
Refrigeration:                                    4,000 VA
Sign load (at least 1,200 VA per sign):           1,200 VA
                                              ──────────
Total demand:                                   52,450 VA

Service A @ 208/120 V 3-phase:
   52,450 / (208 × √3) = 52,450 / 360 = 146 A
   Next standard size: 200 A service

Service A @ 480/277 V 3-phase:
   52,450 / (480 × √3) = 52,450 / 831 = 63 A
   Next standard size: 100 A service
```

The voltage system makes a big difference — 480 V three-phase needs much less current for the same kVA.

## Motors and HVAC — 430.24

Motor loads get special treatment:

```
Largest motor at 125%
All other motors at 100%
```

For HVAC, use the manufacturer's MOCP/MCA from the nameplate.

## Common commercial errors

- Treating all loads as discontinuous (missing the 1.25 multiplier)
- Forgetting the 180 VA receptacle rule
- Using single-phase math on a three-phase service
- Missing show-window or sign loads
- Not adding the largest-motor 125% adder
