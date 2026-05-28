# Sample Exam Question — Grounding

## The question

> A 200 A service is being installed for a single-family dwelling. The service-entrance conductors are 2/0 copper. What is the minimum size grounding electrode conductor (GEC) for connection to:
> a) Two driven ground rods
> b) The metal underground water pipe
> c) A concrete-encased electrode (UFER)

## Reference: Table 250.66 — Grounding Electrode Conductor

| Service conductor size | Min GEC (Cu) |
|---|---|
| #2 or smaller | #8 |
| #1 or 1/0 | #6 |
| **2/0 or 3/0** | **#4** |
| Over 3/0 to 350 kcmil | #2 |
| Over 350 to 600 kcmil | 1/0 |

For a 200 A service with 2/0 copper service conductors, GEC = **#4 copper minimum**.

But Table 250.66 isn't the whole story — different electrode types have specific size limits:

### Step a — Ground rod connection

NEC 250.66(A): **The GEC to a single ground rod or driven rod system need not be larger than #6 copper**.

```
GEC to rods: #6 copper minimum (regardless of service size)
```

This is a common exception. Even with a 400 A service, the GEC to rods is #6.

### Step b — Metal underground water pipe

NEC 250.66 governs water-pipe electrode GEC, sized per the table:

```
GEC to water pipe: #4 copper (for 2/0 service conductor)
```

The water pipe electrode connection follows the full table.

### Step c — Concrete-encased electrode (UFER)

NEC 250.66(B): **The GEC to a concrete-encased electrode need not be larger than #4 copper**.

```
GEC to UFER: #4 copper maximum required
```

For this service size, #4 is the table requirement AND the UFER cap, so #4.

For larger services (e.g., 2,500 kcmil), the table would call for 3/0 GEC — but the UFER cap limits it to #4.

## Summary

| Connection | GEC size |
|---|---|
| To driven rods | **#6 Cu** (cap per 250.66(A)) |
| To water pipe | **#4 Cu** (per Table 250.66) |
| To UFER (concrete) | **#4 Cu** (cap per 250.66(B)) |

## Why the caps exist

The rod and UFER caps recognize that:

- A driven rod can't reasonably handle more current than #6 carries safely
- A UFER provides excellent contact and doesn't need oversize GEC
- The full table sizing is conservative for general use; specific electrode types have known limits

## Common grounding errors

- Sizing the GEC to rods at table value (#4 here) — actually #6 is sufficient
- Sizing GEC to UFER at the full table value when #4 is the cap
- Confusing the GEC (electrode to neutral bond) with the equipment grounding conductor (EGC) sized per Table 250.122
- Forgetting that multiple electrodes use the largest size required for any one (or use of separate GECs to each)
