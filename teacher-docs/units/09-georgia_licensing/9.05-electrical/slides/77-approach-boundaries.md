# Approach Boundaries to Live Parts

## The three approach boundaries

NFPA 70E defines three boundaries around exposed live parts:

```
            Live part
                 │
        Prohibited Approach Boundary
                 │
        Restricted Approach Boundary
                 │
        Limited Approach Boundary
                 │
            Unqualified access
```

Each boundary has different requirements for who may enter and what PPE is needed.

## Limited Approach Boundary

- Distance: depends on voltage
- Who may cross: **Qualified persons only**; or unqualified with a qualified person continuously escorting
- PPE: typical work PPE (safety glasses, hard hat); arc-rated as appropriate

## Restricted Approach Boundary

- Closer to the live part
- Who may cross: Only qualified persons
- PPE: Insulating gloves, AR clothing per the equipment's incident energy

## Prohibited Approach Boundary

- The closest boundary
- Crossing it is equivalent to contact
- Requires the same procedures as physical contact: full insulating equipment, certified procedures, audit

## Distances by voltage (Table 130.4)

For AC systems:

| Voltage range | Limited Approach (Movable conductor) | Limited Approach (Fixed) | Restricted Approach | Prohibited Approach |
|---|---|---|---|---|
| 50-300 V | 10 ft 0 in | 3 ft 6 in | Avoid contact | Avoid contact |
| 301-750 V | 10 ft 0 in | 3 ft 6 in | 1 ft 0 in | 0 ft 1 in |
| 751 V - 15 kV | 10 ft 0 in | 5 ft 0 in | 2 ft 2 in | 0 ft 7 in |
| 15.1 kV - 36 kV | 10 ft 0 in | 6 ft 0 in | 2 ft 7 in | 0 ft 10 in |
| 36.1 kV - 46 kV | 10 ft 0 in | 8 ft 0 in | 2 ft 9 in | 1 ft 5 in |

## Why the boundaries exist

Within the limited approach, an arc fault from the live part poses risk. PPE must be sized for the worst-case arc that could reach the worker at their working distance.

A worker outside the limited approach doesn't need arc-flash PPE for unintentional exposure — but they DO if their work could draw them inside the boundary.

## In practice

For a worker doing routine task in 480 V switchgear:

```
Voltage: 480 V → 301-750 V row
Boundaries:
  Limited approach (fixed): 3 ft 6 in
  Restricted approach: 1 ft 0 in
  Prohibited approach: 0 ft 1 in

Worker stands ~3 ft back = inside limited but outside restricted.
PPE required for that distance: per incident energy analysis.
```

## Posting

The arc-flash warning label must include:

- Voltage rating
- Arc flash boundary distance
- Incident energy at working distance
- Limited approach distance

This lets workers know what's required before they get inside the boundary.

## Common approach boundary errors

- Treating "I'm not touching anything" as safe — proximity matters too
- Ignoring the arc flash boundary for non-contact work near the panel
- Allowing unqualified personnel into the limited approach
- Failing to update boundary distances after equipment modifications
