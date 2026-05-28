# Voltage Drop — Single Phase

## Why it matters

Conductors have resistance. Current flowing through resistance produces a voltage drop, lowering voltage at the load. For motors and electronics, voltage drop causes:

- Reduced motor torque (motors require their rated voltage for full output)
- Lights to dim
- Electronic equipment malfunction
- Heating in the conductor

NEC recommends keeping total voltage drop at the farthest outlet to **≤ 3% on branch circuits** and **≤ 5% total (feeder + branch)**.

## The single-phase formula

```
VD = (2 × K × I × L) / CM
```

Where:
- VD = voltage drop (volts)
- 2 = round-trip distance factor
- K = constant: 12.9 for copper, 21.2 for aluminum
- I = current (amps)
- L = one-way length (feet)
- CM = circular mils of the conductor

## Circular mils — Table 8 NEC

Common conductor circular mil values:

| AWG | CM (Copper, solid) |
|---|---|
| #14 | 4,110 |
| #12 | 6,530 |
| #10 | 10,380 |
| #8 | 16,510 |
| #6 | 26,240 |
| #4 | 41,740 |
| #2 | 66,360 |
| 1/0 | 105,600 |
| 2/0 | 133,100 |
| 4/0 | 211,600 |

## Worked example

```
A 20 A load at 120 V, single-phase, 100 ft away, on #12 Cu:
   VD = (2 × 12.9 × 20 × 100) / 6,530
   VD = 51,600 / 6,530
   VD = 7.9 V

   Voltage at load: 120 - 7.9 = 112.1 V
   Drop percentage: 7.9 / 120 = 6.6%
```

6.6% exceeds the 3% recommendation. Upsize to #10 Cu:

```
VD = (2 × 12.9 × 20 × 100) / 10,380
VD = 51,600 / 10,380
VD = 5.0 V

Drop percentage: 5.0 / 120 = 4.1%   (still over 3%)
```

Upsize again to #8:

```
VD = (2 × 12.9 × 20 × 100) / 16,510 = 3.1 V (2.6%)
```

#8 Cu satisfies the 3% rule for this run.

## The 3% / 5% rule

NEC 210.19(A)(1) FPN 4 (and 215.2(A)(4) for feeders):

| Path | Max recommended VD |
|---|---|
| Branch circuit only | 3% |
| Feeder + branch (combined) | 5% |

These are recommendations — they're informational, not enforceable. But most jurisdictions and engineers treat them as design rules.

## Quick reality check

For 120 V circuits, 3% = 3.6 V drop. For 240 V circuits, 3% = 7.2 V drop.

The longer the run, the more voltage drop. The remedy is always larger conductor — there's no other lever to pull.
