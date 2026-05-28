# Optional Dwelling Calculation (NEC 220.82)

## When you can use it

The optional method for a one-family dwelling unit OR each unit of a multifamily dwelling. Must have a service rated at **100 A or greater**.

## How it differs from standard

| Standard method (220 Part III) | Optional method (220.82) |
|---|---|
| Apply demand factors by load type | Apply demand factor to total |
| Each appliance handled separately | Sum first, then demand |
| Heating + AC handled by largest | Same — largest only |
| Generally larger result | Generally smaller result |

## The optional formula

```
Step 1: Sum these loads at nameplate (no demand applied yet):
   - 3 VA × sqft (general lighting + small-appliance + laundry)
   - All fixed appliances at nameplate
   - Range at nameplate (not table 220.55)
   - Dryer at nameplate
   - Other 240 V appliances at nameplate

Step 2: Apply progressive demand:
   - First 10 kVA @ 100%
   - Remainder over 10 kVA @ 40%

Step 3: Add the largest of:
   - Air conditioning (running watts × 1.25 if it's compressor-only)
   - Heating system (sized for actual installed capacity)
   - Storage water heater if separately
```

## Worked example

A 2,400 sqft dwelling:

```
General + small-appl + laundry: 11,700 VA
Range nameplate:                12,000 VA
Dryer nameplate:                 5,500 VA
Water heater nameplate:          4,500 VA
Dishwasher nameplate:            1,200 VA
Disposal nameplate:                900 VA
Microwave nameplate:             1,400 VA
                                ─────────
Sum:                            37,200 VA

Apply demand:
   First 10,000 @ 100%:         10,000
   Remainder 27,200 @ 40%:      10,880
                                ─────────
Subtotal:                       20,880

Largest of heat or AC:
   AC (compressor): 4,800 W → 4,800
   Heat (10,000 W): 10,000  ← larger
   Use:                         10,000
                                ─────────
Total demand:                   30,880 VA

Service A = 30,880 / 240 = 128.7 A
   → 150 A or 200 A service
```

## When optional method wins (smaller result)

For dwelling units that have:

- High proportion of dedicated 240 V appliances (range, dryer, water heater)
- Significant heating + AC (only the larger is added)
- Standard residential load mix

The optional method's progressive 100% / 40% structure rewards diversity of load and typically yields a 30-40% smaller required service than the standard method.

## When optional method doesn't help

- Very small dwellings with few appliances
- Service < 100 A (optional method not allowed)
- Heavy industrial-style loads concentrated in a residence

## Which method to use on the exam

The exam usually specifies which method to apply. If unspecified, use whichever produces a service size that matches the answer choices.

## Common optional-method errors

- Using table 220.55 range demand instead of nameplate
- Adding both heating AND AC (must be largest only)
- Forgetting to subtract heating from the appliance sum (it's added at the end)
- Applying demand factor twice
