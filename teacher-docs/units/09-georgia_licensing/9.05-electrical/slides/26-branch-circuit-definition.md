# Branch Circuit Definition + Types

## NEC definition (Article 100)

> **Branch Circuit.** The circuit conductors between the final overcurrent device protecting the circuit and the outlet(s).

Three keywords:
- **Final OCPD** — the last breaker or fuse
- **Outlet(s)** — where current is taken to supply utilization equipment
- **Between** — branch circuits stop at the load

## Branch circuit types

| Type | Definition |
|---|---|
| **General-purpose** | Supplies two or more receptacles or outlets for lighting and appliances |
| **Appliance** | Supplies appliance outlets for general appliance use (no lighting) |
| **Individual** | Supplies a single piece of utilization equipment |
| **Multiwire** | Two or more ungrounded conductors with a common neutral, with voltage between ungrounded conductors and equal voltage from each to neutral |

## Multiwire branch circuit (MWBC) — 210.4

A frequently tested topic. A multiwire branch circuit:

```
    Hot 1 (Ph A) ──────╮
    Hot 2 (Ph B) ──────┤  Common neutral ── carries imbalance only
    Neutral     ──────╯
```

Rules:
- All ungrounded conductors must originate from the SAME panel
- Must have a means to simultaneously disconnect all ungrounded conductors (handle ties or 2-pole breaker)
- Cannot supply line-to-neutral loads only — must be split across phases

## Branch circuit ratings

A branch circuit's rating equals the rating of the OCPD protecting it. Common ratings:

| OCPD | Branch ckt rating | Common use |
|---|---|---|
| 15 A | 15 A | General lighting, receptacles |
| 20 A | 20 A | Kitchen receptacles, bathroom |
| 30 A | 30 A | Dryers (240 V), small water heaters |
| 40 A | 40 A | Electric ranges |
| 50 A | 50 A | Large ranges, EV chargers |

## Continuous loads — 210.20(A)

If a branch circuit supplies continuous loads (load for 3 hours or more), the OCPD and conductors must be sized at **125%** of the continuous load.

```
Continuous load: 16 A
Required OCPD: 16 × 1.25 = 20 A
```

## Receptacle count limit — 210.21(B)(3)

Number of receptacles on a single 20 A circuit:

- General use: no specific limit, but designers typically cap at 10-13 receptacles
- Dwelling unit lighting + receptacles: still limited only by load calc

For non-dwelling: the NEC uses 180 VA per receptacle as a design value. A 20 A circuit @ 120 V = 2400 VA → 2400 / 180 = 13.3, so 13 receptacles max in non-dwelling.
