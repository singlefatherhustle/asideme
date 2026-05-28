# AFCI Requirements (NEC 210.12)

## What AFCI protects

An arc-fault circuit interrupter detects the unique current signature of an arcing fault — the kind that causes fires in damaged or loose wiring. AFCIs trip on:

- Series arcs (broken conductor)
- Parallel arcs (two conductors arcing to each other)
- Ground arcs (conductor arcing to ground)

The trip threshold is different from GFCI — AFCI watches *waveform shape*, not just imbalance.

## Where AFCI is required — dwellings (210.12)

**All 120 V, 15 A and 20 A branch circuits** supplying outlets or devices installed in:

```
- Kitchens
- Family rooms
- Dining rooms
- Living rooms
- Parlors
- Libraries
- Dens
- Bedrooms
- Sunrooms
- Recreation rooms
- Closets
- Hallways
- Laundry areas
- Similar rooms
```

That's essentially every habitable room in a dwelling.

## Where AFCI is NOT required (dwelling)

- Bathrooms (GFCI handles it)
- Garages (GFCI handles it)
- Outside receptacles
- Unfinished spaces below grade (GFCI handles it)

## Non-dwelling AFCI (2023 NEC)

The 2023 NEC adds AFCI requirements for non-dwelling occupancies in:

- Patient sleeping rooms in nursing homes
- Patient sleeping rooms in limited-care facilities
- Dormitories
- Some hotel/motel guest rooms

Check the specific 2023 NEC update when sitting the post-2026 exam.

## AFCI types

| Type | Coverage |
|---|---|
| **Combination AFCI breaker** | Whole circuit from the panel |
| **AFCI receptacle (OBC type)** | First receptacle on a circuit; protects downstream |
| **AFCI + GFCI combo breaker** | Both protections in one device |

## Why AFCI nuisance trips happen

- Old wiring with degraded insulation
- Cheap dimmer switches with noisy waveforms
- Vacuum cleaners and power tools with arcing brushes
- Defective AFCI devices (rare but possible)

Diagnosing nuisance trips is a meaningful service-call category. Step through:

1. Unplug everything on the circuit
2. Reset the AFCI
3. Plug in loads one at a time; identify which trips it
4. If no load trips it: investigate the wiring itself

## AFCI on shared neutral

Multiwire branch circuits sharing a neutral require **two-pole AFCI breakers** that monitor both legs simultaneously. Single-pole AFCIs on each leg won't work correctly because the neutral imbalance reads wrong.
