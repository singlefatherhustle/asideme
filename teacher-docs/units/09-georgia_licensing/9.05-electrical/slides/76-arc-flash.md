# Arc Flash Basics

## What an arc flash is

An electrical arc fault — current jumps through air, creating an extremely hot plasma. Temperatures can exceed 19,000°C (35,000°F) — hotter than the sun's surface.

Arc faults release massive energy in milliseconds:

- Radiated heat (causes burns)
- Pressure wave (arc blast — can blow workers off ladders)
- Molten metal debris (high-velocity copper droplets)
- Toxic fumes (vaporized insulation)
- Intense light (eye damage)

## Why arc flash analysis is required

NFPA 70E and OSHA expect:

1. **Arc-flash hazard analysis** for each piece of equipment
2. **Field-applied warning label** showing incident energy and PPE category
3. **Approach boundaries** defined
4. **PPE requirements** documented and followed

## Incident energy

The thermal energy released per unit area at the working distance:

```
Units: cal/cm²
```

A worker's skin will second-degree burn at:

```
~1.2 cal/cm² (without PPE)
```

PPE is rated to withstand a certain cal/cm² — wearing 8 cal/cm² PPE means the rated AR clothing absorbs that much energy before reaching the skin.

## Working distance

Standard working distance assumptions:

| Equipment type | Distance |
|---|---|
| Switchgear ≤ 1 kV | 18 inches |
| Switchgear 5-15 kV | 36 inches |
| Motor control center | 18 inches |

Incident energy is calculated at this distance.

## Arc flash boundary

The distance at which incident energy = 1.2 cal/cm². Beyond this distance, no PPE is required for unintentional exposure.

```
Arc flash boundary: from equipment outward
   ↑
   1.2 cal/cm² isoclinal — second-degree burn threshold
```

A boundary of 5 feet means anyone within 5 feet during an arc must have PPE.

## How to reduce arc flash hazard

1. **De-energize the equipment** (best — no hazard)
2. **Lower the available fault current** (impractical for existing service)
3. **Faster OCPD clearing** — faster trips = less energy released
4. **Higher OCPD with current-limiting characteristic** — limits the peak current of an arc
5. **Modify equipment for arc-resistant design** (very expensive retrofits)

The biggest practical reduction: shorter clearing time. A breaker that opens in 0.1 seconds releases far less arc energy than one taking 1 second.

## Arc flash warning labels

Required field labels (110.16 NEC, also NFPA 70E):

```
   ╔═══════════════════════════════════════╗
   ║         WARNING                       ║
   ║                                       ║
   ║   ARC FLASH AND SHOCK HAZARD          ║
   ║                                       ║
   ║   480V Three Phase                    ║
   ║   Incident Energy: 8.2 cal/cm²        ║
   ║   PPE Category: 2                     ║
   ║   Arc Flash Boundary: 36 inches       ║
   ║   Limited Approach: 42 inches         ║
   ║                                       ║
   ║   APPROPRIATE PPE REQUIRED            ║
   ╚═══════════════════════════════════════╝
```

The label is created from the engineering analysis and must be updated when system changes affect available fault current.
