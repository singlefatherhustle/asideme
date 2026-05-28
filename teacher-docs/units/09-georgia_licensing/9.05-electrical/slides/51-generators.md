# Generators (NEC Article 445)

## Two installation modes

| Mode | Description |
|---|---|
| **Standby** | Automatic switchover via ATS when utility fails (whole-home or critical loads) |
| **Optional / Portable** | Manual connection through inlet box and interlock |

## Sizing — 445.13

Generator output conductors must be sized to carry **at least 115% of the generator nameplate current rating**.

```
Generator: 22 kW @ 240 V single-phase
   Nameplate amps: 22,000 / 240 = 91.7 A
   Conductor min: 91.7 × 1.15 = 105 A → #2 Cu (110 A @ 75°C)
```

## Overcurrent protection — 445.12

OCPDs are required for generators:

- Sized at not more than 115% of nameplate
- Generator nameplate may serve as the OCPD if the device has built-in protection (some standby models)

## Transfer switch (ATS) — 700, 701, 702

The transfer switch isolates the building's electrical system from the utility when on generator power:

- **Open-transition** ATS: brief power gap during transfer (most residential)
- **Closed-transition**: synchronizes generator with utility before transfer (commercial)
- **Manual transfer switch**: lever-operated, no automatic switching

ATS is rated for:

- Total amperage of the generator
- Number of poles (single-phase = 2-pole; three-phase = 3- or 4-pole)
- Service-rated vs feeder-rated (changes installation requirements)

## Interlock for portable generators

Portable generators connected to the home through an inlet box and a panel must have a **listed interlock** that prevents simultaneous connection to utility and generator. Backfeeding utility lines through a generator can kill linemen.

```
Inlet box (outside) ─ cord ─ panel inlet
                                  │
                                  ▼
                          Generator breaker (interlock kit)
                                  │
                                  └── Main breaker
                                         (only one can be ON at a time)
```

## Grounding — 250.34

Portable generators with a frame and a bonded neutral are **separately derived systems** when connected through an ATS that switches the neutral.

Most residential setups use **non-separately derived** — generator neutral is NOT bonded; the building's main bond serves both utility and generator paths.

## Sizing the generator

Two approaches:

1. **Critical-load only** (Optional Standby): size for refrigerator, HVAC, well pump, key lights, ~10 kW typical
2. **Whole-home backup**: size for full service load, may require load-shed contactors to reduce non-essential demand

## Common generator errors

- Backfeeding through a dryer cord (highly illegal)
- Missing the interlock device (no simultaneous-throw protection)
- Undersized conductor between generator and ATS
- Not bonding neutral correctly for separately derived setup
- Installing generator too close to building openings (CO hazard)
