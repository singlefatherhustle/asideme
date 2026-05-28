# Motor Short-Circuit and Ground-Fault Protection (NEC 430 Part IV)

## What this protects against

Sudden fault currents — short circuits or ground faults. These can be 10× to 50× the motor FLA and need to trip in milliseconds.

This is **separate** from overload protection, which handles slow over-currents.

## Table 430.52(C)(1) — sizing

The required BCP rating is a multiple of motor FLA, depending on the OCPD type:

| OCPD type | Max % of FLA |
|---|---|
| **Non-time-delay fuse** | 300% |
| **Dual-element (time-delay) fuse** | 175% |
| **Instantaneous-only breaker** | 800% (motor circuit only) |
| **Inverse-time breaker** | 250% |

For most installations: inverse-time breaker at 250% of FLA.

## Worked example — inverse-time breaker

```
10 HP, 3Ø, 230 V motor: FLA = 28 A

Branch circuit protection = 28 × 2.50 = 70 A
                                          ↓
                                Next standard size = 70 A

Use a 70 A standard breaker. (90 A also OK if exception 1 applies.)
```

## Increasing beyond table values — 430.52 exception 1

If the value from the table won't start the motor (nuisance trip on inrush), you may increase to the **next standard size** UP. Limits:

| OCPD type | Max increase |
|---|---|
| Non-time-delay fuse | 400% |
| Dual-element fuse | 225% |
| Instantaneous breaker | 1300% |
| Inverse-time breaker | 400% |

In practice: take Table 430.52 value, round up to next standard size. If the motor still won't start (rare), check the next-size-up exception.

## Locked-rotor current — Table 430.251

For starting-current calculations, NEC provides locked-rotor current (LRA) per HP and voltage. Generally:

```
LRA ≈ 6 × FLA  (rough rule of thumb)
```

The BCP must be selected to ride through this brief LRA period without tripping.

## Standard fuse and breaker sizes

When the calculated BCP value isn't a standard size, round UP to the next standard size from 240.6(A):

```
15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150,
175, 200, 225, 250, 300, 350, 400, 450, 500, 600, 700, 800, 1000,
1200, 1600, 2000, 2500, 3000, 4000, 5000, 6000
```

## Common BCP errors

- Selecting the wrong OCPD type column (using 250% when device is dual-element fuse)
- Forgetting to round up to standard size
- Using BCP value beyond exception 1 limit (e.g., 500% for an inverse-time breaker)
