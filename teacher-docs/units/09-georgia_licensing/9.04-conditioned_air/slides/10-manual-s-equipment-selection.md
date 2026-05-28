# ACCA Manual S — Equipment Selection

## What it is

Manual S provides procedure for selecting the right equipment based on Manual J load calculations and Manual D duct design.

## The big picture

```
Manual J → calculates the LOAD (BTU/hr needed)
Manual D → designs the DUCT system to deliver airflow
Manual S → picks the EQUIPMENT to match
```

All three must work together. Manual S verifies that the chosen unit can:

- Deliver the required cooling/heating BTU at design conditions
- Move the required airflow at the calculated static pressure
- Operate within its design parameters

## Equipment performance data

Manufacturers publish detailed performance data for each model:

```
For an outdoor condenser:
  Capacity (BTU/hr) at various outdoor temperatures
  EER and SEER values
  Compressor amperage
  Refrigerant type and charge

For an indoor air handler:
  Available external static pressure (ESP)
  Airflow vs static pressure curve
  Coil capacity matching with condenser
  Heating element options (for heat pumps)

For matched system:
  AHRI rating (capacity + efficiency for matched combination)
  Latent capacity
  Sensible Heat Ratio (SHR)
```

## The matched system

Outdoor + indoor unit must be tested as a matched pair:

- AHRI certification confirms the combination's performance
- Mismatched components (different brand, wrong size indoor coil) lose AHRI certification
- AHRI rating database (available online) shows certified combinations

For exam: "matched system" = AHRI-certified pair of outdoor and indoor units.

## Selecting capacity

For a load of 17,000 BTU/hr cooling:

```
1.5 ton system:    18,000 BTU/hr — closest match without oversizing
2.0 ton system:    24,000 BTU/hr — would be oversized by 41%
```

Manual S recommends sizing UP to nearest standard, NOT down. A slightly oversized unit is better than undersized.

Standard residential sizes (BTU/hr):

- 18,000 (1.5 ton)
- 24,000 (2 ton)
- 30,000 (2.5 ton)
- 36,000 (3 ton)
- 42,000 (3.5 ton)
- 48,000 (4 ton)
- 60,000 (5 ton)

## Capacity at design conditions

Manufacturer's table at 95°F outdoor + 80°F return:

```
3-ton unit nominal:    36,000 BTU/hr
At 95°F / 80°F return: 34,500 BTU/hr (sensible + latent)
Sensible: 26,500 BTU/hr
Latent:   8,000 BTU/hr
```

This shows the unit can deliver the load at design conditions.

## Static pressure verification

```
Manufacturer's air handler:
   Available External Static Pressure (ESP) at design CFM = 0.5 in W.C.

Duct system design (from Manual D):
   Total resistance at design CFM = 0.4 in W.C.

✓ Equipment can deliver the airflow at the calculated resistance
```

If duct resistance exceeds equipment ESP: undersized airflow, premature equipment failure.

## SEER vs SEER2

```
SEER (older standard, 2023 and before)
SEER2 (current standard, 2023 onward)
```

SEER2 uses different test conditions (more realistic). A 16 SEER unit ≈ 15 SEER2 unit. Don't confuse them when comparing equipment specs.

## Common Manual S errors

- Sizing equipment to match the building footprint instead of the calculated load
- Choosing the wrong indoor coil for the outdoor unit (mismatch)
- Forgetting to verify static pressure capability
- Selecting based only on SEER, not on actual capacity at design conditions
- Picking a unit because of price without verifying performance
- Using nominal capacity (manufacturer's marketing number) instead of design-condition capacity
