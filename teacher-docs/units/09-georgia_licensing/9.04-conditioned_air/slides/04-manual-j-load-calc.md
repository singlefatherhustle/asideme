# ACCA Manual J — Residential Load Calculation

## What it is

The ACCA Manual J procedure calculates the heating and cooling load for a residential building. The Georgia exam expects you to know:

- How to use the procedure
- What inputs are required
- How to interpret the output

## What load calc determines

```
Sensible cooling load: BTU/hr to remove sensible heat (temperature)
Latent cooling load:   BTU/hr to remove moisture
Total cooling load:    Sensible + Latent
Heating load:          BTU/hr to add for heating
```

These determine the equipment size (BTU/hr) needed.

## Why proper sizing matters

Oversized AC:
- Short cycles (turns on/off rapidly)
- Doesn't dehumidify (cool air feels clammy)
- Wastes energy on startup losses
- Customer complaints

Undersized AC:
- Never reaches set point on hot days
- Runs continuously, can't recover
- Energy bills higher than necessary
- Equipment lifespan shortened

The Manual J answer is "build the right size — not too big, not too small."

## Key inputs

1. **Climate zone** — Georgia is mostly Zone 3 (Atlanta) or Zone 2 (south)
2. **Design temperatures** — outdoor design (e.g., 95°F for cooling) and indoor design (e.g., 75°F)
3. **Building envelope** — wall, roof, window areas + U-values + insulation R-values
4. **Air leakage** — measured or estimated infiltration rate
5. **Internal gains** — people, lights, equipment
6. **Building orientation** — solar exposure on each facade
7. **Window characteristics** — area + solar heat gain coefficient (SHGC)

## Simple cooling load formula

```
Cooling load (BTU/hr) = Conduction load
                       + Solar gain through windows
                       + Infiltration load
                       + Internal load (people, lights, equipment)
                       + Latent load (moisture from breathing, cooking)
```

## Worked example

```
2,400 sq ft single-family in Atlanta:

  Conduction (envelope):       8,000 BTU/hr
  Solar (windows):             4,000 BTU/hr
  Infiltration:                3,000 BTU/hr
  Internal (4 people + lights): 2,000 BTU/hr
                              ─────────
  Sensible cooling load:      17,000 BTU/hr

  Latent (moisture):           3,000 BTU/hr
                              ─────────
  Total cooling load:         20,000 BTU/hr

  Equipment sizing:
    Required: 20,000 BTU/hr (1.67 tons)
    Nearest size: 2-ton AC (24,000 BTU/hr)
```

## Common Manual J errors

- **Rule of thumb sizing**: "1 ton per 600 sq ft" — wildly inaccurate. Always do Manual J.
- **Underestimating glass area**: large windows drive up cooling load significantly
- **Forgetting orientation**: south-facing windows are very different from north-facing
- **Missing infiltration**: old leaky homes have high infiltration loads
- **Skipping latent load** in humid climates: undersizes the dehumidification capacity
- **Using outdated design temperatures**: climate data changes; use current ASHRAE figures

## Software vs hand calc

```
Hand calc (ACCA spreadsheet):
  - Time-consuming (1-2 hours per house)
  - Subject to math errors
  - Good for understanding

Software (Wrightsoft, Elite, etc.):
  - Faster (15-30 min per house)
  - Less error-prone
  - Required by most modern jurisdictions for permit submission
```

The exam tests your understanding of the procedure, not your software skills.
