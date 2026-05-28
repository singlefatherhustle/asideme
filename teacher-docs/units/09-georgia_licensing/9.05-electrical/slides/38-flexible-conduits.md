# Flexible Conduits — FMC and LFMC

## Two types

| Conduit | Article | Construction |
|---|---|---|
| **FMC** (Flexible Metal Conduit) | 348 | Spirally-wound steel strip, no jacket |
| **LFMC** (Liquidtight Flexible Metal Conduit) | 350 | FMC core + waterproof plastic jacket |

## FMC — "Greenfield"

Older trade name: Greenfield. The standard for short flexible runs to motors, transformers, and equipment that vibrates or moves.

### Allowed uses (348.10)

- Dry, exposed or concealed work
- Where flexibility is needed (motor connections, etc.)
- Listed for direct burial only if marked as such (rare)

### Prohibited uses (348.12)

- Wet locations (use LFMC instead)
- Hoistways (use LFMC or RMC)
- In storage battery rooms
- Areas with hazardous classifications (except specific)
- Underground

## LFMC — for wet / damp / outdoor

The jacket makes LFMC suitable for:

- Outdoor equipment connections
- Wet locations
- Where condensation or splash is expected
- Limited locations subject to oil or chemicals (check listing)

## Equipment grounding conductor in flex

This is heavily tested. The flex itself may serve as the EGC ONLY IF:

```
1. Combined length of all flexible raceway in the ground path is ≤ 6 ft
2. The conductors inside are ≤ 20 A circuit rating
3. The flexible raceway is terminated in fittings listed for grounding
4. The flex is not installed for flexibility (i.e., motor connection)
```

Otherwise (most cases) you must install a separate EGC inside the flex.

## Common LFMC use: motor whip

Standard install for a motor disconnect to a motor:

```
   Junction box on wall
   │
   │ EMT
   │
   Motor disconnect (within sight)
   │
   │ LFMC (≤ 6 ft, for vibration)
   │
   Motor
```

LFMC absorbs the vibration of the motor without transferring it to the rigid raceway upstream.

## Bend radius — Table 350.24

Minimum bending radius is significantly larger than rigid raceways. For LFMC 1/2 inch trade size: minimum 4 inches radius (12× cable diameter).

## Securing — 348.30 / 350.30

- Within 12 inches of every termination
- Then every 4.5 feet along run
- Listed straps or supports only

## Common flex errors

- Using FMC in a wet location (must be LFMC)
- Relying on the flex armor as EGC when total length exceeds 6 ft
- Forgetting to install a separate EGC for flex used for flexibility
- Over-tight bends that crack the helical wrap
