# Drainage System Design

## What it does

The drainage (DWV — Drain, Waste, Vent) system removes wastewater from fixtures to the sanitary sewer or septic system, while preventing sewer gas from entering the building.

```
Fixture → Trap → Trap arm → Vertical waste → Building drain → 
Building sewer → Public sewer or septic
```

## Drainage Fixture Unit (DFU)

Each fixture generates a DFU value representing its drainage demand:

| Fixture | DFU |
|---|---|
| Bathtub | 2 |
| Bidet | 1 |
| Clothes washer (standpipe) | 2 |
| Dishwasher | 2 |
| Floor drain | 0.5 |
| Kitchen sink | 2 |
| Lavatory | 1 |
| Shower | 2 |
| Service sink / mop sink | 3 |
| Sink (commercial) | 2 |
| Toilet (water closet) | 4 |
| Urinal | 4 |
| Wash basin (3-bowl commercial) | 5 |

Sum DFUs in each pipe segment to determine required pipe size.

## Pipe sizing — drainage

NEC IPC Table 710.1(2) gives drainage pipe sizing based on DFU and slope:

```
1-1/4 inch:  1 DFU max (1.5 DFU @ 1/4 in/ft slope)
1-1/2 inch:  3 DFU
2 inch:      6 DFU
2-1/2 inch:  12 DFU
3 inch:      20-30 DFU (depends on slope; 6 max for water closet)
4 inch:      90-180 DFU (for building drain depending on slope)
```

For a typical bath group:

- Tub + shower + lavatory + toilet = 9 DFU
- 3-inch drainage line minimum

## Pipe materials

| Material | Use |
|---|---|
| Cast iron | Older construction, durable; expensive |
| PVC | Most common modern residential drainage |
| ABS | Similar to PVC, less common |
| Copper (DWV grade) | Above-ground, rare |
| HDPE | Underground only |

## Slope requirements

```
2-1/2 inch and smaller: 1/4 inch per foot minimum
3 inch and larger:      1/8 inch per foot minimum
```

Too steep:
- Solids settle out, leave the water moving fast
- Liquids run ahead of solids = clog

Too shallow:
- Solids stop and accumulate
- Water doesn't flow

Code-required slope balances both extremes.

## Cleanouts

Required at:

```
1. Origin of every building drain
2. Each change in horizontal direction > 45°
3. At intervals of 100 feet maximum
4. At each branch where DFU exceeds threshold
5. At base of vertical riser
```

Cleanouts must be accessible:

- Minimum clearance: 18 inches in front of cleanout
- May be flush-mounted in floor (with proper cover)
- Wall-mounted accessible without obstruction

## Building drain vs sewer

```
Building drain: from fixture branches to 30" outside building
Building sewer: from building drain to property line / utility
```

The transition often happens at the foundation wall.

## Floor drains

```
Required in:
- Public bathrooms (some occupancies)
- Boiler rooms
- Laundry rooms (over washer alcove)
- Mechanical rooms
- Indoor pool decks

Required venting (treats as a fixture)
DFU: 0.5
```

## Trap arm distance

Trap arm = horizontal segment between trap weir and vent fitting.

```
Maximum trap arm length:
   1-1/4 inch fixture: 30 inches
   1-1/2 inch:         42 inches  
   2 inch:             60 inches
   3 inch:             72 inches
   4+ inch:            120 inches
```

Why limited: longer trap arms allow water to siphon out of trap, breaking the seal.

## Common drainage errors

- DFU table misread (using supply table instead of drainage)
- Wrong slope (too steep or too shallow)
- Missing cleanouts at code-required intervals
- Floor drain without proper trap and venting
- Mixed pipe materials with incompatible fittings
- Trap arm exceeded for the pipe size
- Improper offset/double 90° (creates a S-trap configuration)
