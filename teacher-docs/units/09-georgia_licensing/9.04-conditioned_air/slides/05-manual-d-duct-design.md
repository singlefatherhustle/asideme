# ACCA Manual D — Duct Design

## What it is

ACCA Manual D is the procedure for sizing residential air distribution systems (ductwork). It ensures:

- Adequate airflow to each room
- Acceptable noise levels
- Reasonable static pressure
- Balanced system

## Inputs to Manual D

```
1. CFM per room (from Manual J load calc)
2. Total CFM for the system
3. Available static pressure (from equipment manufacturer)
4. Duct material and shape
5. Run lengths
6. Fittings (elbows, transitions, etc.)
```

## Standard CFM rates

Cooling-mode CFM per ton:

```
400 CFM/ton (standard)
350 CFM/ton (high-humidity climates like the Southeast)
450 CFM/ton (low-latent / high-altitude)
```

For 3-ton system: 3 × 400 = 1,200 CFM total airflow.

## Sizing approach

```
1. Distribute total CFM to rooms based on load
2. Lay out the duct network
3. Calculate equivalent length (run length + fitting losses)
4. Pick duct size that matches CFM at available static pressure
```

## Equivalent length

```
Actual length (ft) + Equivalent length of fittings (ft) = Total equivalent length
```

Each fitting has an equivalent length added — typical examples:

| Fitting | Equivalent length |
|---|---|
| 90° smooth elbow | 10 ft |
| 90° sharp elbow | 30 ft |
| Transition fitting | 15 ft |
| Diffuser | 10 ft |

A simple-looking duct run with multiple elbows can have 100+ ft of equivalent length.

## Friction rate

```
Friction rate (in W.C./100 ft) = External Static Pressure / Total Equivalent Length × 100

Example:
   ESP available: 0.40 in W.C. (typical residential)
   Total equivalent length: 200 ft
   Friction rate: 0.40 / 200 × 100 = 0.20 in W.C./100 ft
```

This friction rate is used to look up duct size from a chart.

## Duct size selection

For a given CFM and friction rate, use the duct sizing chart:

```
CFM 600 at 0.20 in W.C./100 ft → 10" round duct or 8"×16" rectangular
CFM 100 at 0.20 in W.C./100 ft → 6" round duct or 4"×10" rectangular
```

Round ducts are more efficient than rectangular for the same airflow.

## Common Manual D errors

- **Sizing all ducts the same**: branch ducts should be smaller than trunk
- **Ignoring equivalent length**: actual length only is too short
- **Forgetting transitions**: each diameter change adds equivalent length
- **Using oversized fittings**: doesn't fix undersized straight runs
- **Skipping balance dampers**: each branch needs adjustability for balancing
- **Inadequate return air**: design returns proportional to supply (often forgotten)

## Sizing rules of thumb (NOT for exam)

For quick field check (use Manual D for actual design):

```
1 sq inch of duct cross-section ≈ 1 CFM at standard velocity
   (very rough; use Manual D for actual)

For a 3-ton system (1,200 CFM):
   Main trunk: 16×8 or 14×10 or 12 round
   Largest branch: 10 round
   Smallest branch: 6 round
```

## Why ducts are often wrong

In the field, oversized ducts come from "we always do 14x10 for residential." Manual D forces you to actually size to the load. The result is:

- Smaller ducts (cheaper material, fits in soffits/joists)
- Better airflow balancing
- Quieter operation
- Better dehumidification (slower air = more time at coil)
