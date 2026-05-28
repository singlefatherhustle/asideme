# Motor Branch-Circuit Conductors (NEC 430.22)

## The 125% rule

Single motor branch circuit conductors must have ampacity not less than **125% of the motor's full-load current** (from NEC table, not nameplate).

```
Motor FLA × 1.25 = Min conductor ampacity
```

## Why 125%

Motors run continuously (the load is sustained). The 125% multiplier provides:

- Margin for start-up current heating
- Compliance with the continuous-load rule for branch circuits
- Reduced voltage drop at the motor terminals

## Worked example — single motor

```
20 HP, 3Ø, 460 V motor:
   FLA from Table 430.250 = 27 A
   Required ampacity = 27 × 1.25 = 33.75 A

   Conductor at 75°C termination:
     #10 Cu = 35 A ✓ FITS

   Use #10 THHN copper with 75°C terminations
```

## Multiple motors on one branch circuit — 430.24

When several motors share a branch circuit:

```
Conductor ampacity ≥ 125% × FLA(largest motor) + sum of all other motor FLAs at 100%
```

Example: three motors on one circuit — 10 HP, 5 HP, 5 HP at 230 V three-phase:

```
FLAs: 28 A, 15.2 A, 15.2 A

Largest × 1.25:  28 × 1.25 = 35
Others × 1.00:  15.2 + 15.2 = 30.4
                            ──────
Total required ampacity:    65.4 A

Use #6 Cu (65 A at 75°C, round up to next size) or #4 (85 A) for headroom
```

## Equipment grounding conductor — Table 250.122

Sized by upstream OCPD rating:

| OCPD | Min EGC (Cu) |
|---|---|
| 15 A | #14 |
| 20 A | #12 |
| 30 A | #10 |
| 40 A | #10 |
| 60 A | #10 |
| 100 A | #8 |
| 200 A | #6 |
| 300 A | #4 |
| 400 A | #3 |
| 600 A | #1 |

EGC sizing is independent of conductor ampacity. A 100 A breaker requires #8 EGC regardless of whether the conductor is #6 or #3.

## Termination temperature trap

When using 90°C-rated conductor (THHN) but the breaker terminals are rated 75°C, you must use the **75°C column** of the ampacity table. The high temp rating helps with derating but doesn't increase the connection's allowable ampacity.

```
#10 THHN: 90°C ampacity = 40 A
But breaker rated 75°C → use 75°C ampacity = 35 A
```

This trap costs candidates points on the exam constantly. Always check termination temp.

## Common motor conductor errors

- Sizing to FLA directly (not 125%)
- Using nameplate amps (not NEC table)
- Selecting the 90°C column when terminations are rated 75°C
- Forgetting the largest-motor adder for multiple motors on one circuit
