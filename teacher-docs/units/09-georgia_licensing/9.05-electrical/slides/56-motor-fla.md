# Motor Full-Load Amps (Tables 430.247-250)

## Why NEC tables, not nameplate

When sizing motor circuit components, the **NEC table FLA** is used, NOT the nameplate amperage. Reasons:

- Standardized values across manufacturers
- Includes typical operating conditions
- Predictable for inspectors and designers

The nameplate FLA is used for actual overload protection setting, but conductors and BCPs come from the tables.

## Table layout

Each table covers one motor type:

| Table | Type |
|---|---|
| 430.247 | DC motors |
| 430.248 | Single-phase AC motors |
| 430.249 | Two-phase AC motors |
| **430.250** | **Three-phase AC motors** (most common) |

## Common 3Ø motor FLA values — Table 430.250

| HP | 200 V | 230 V | 460 V | 575 V |
|---|---|---|---|---|
| 1/2 | 2.5 | 2.2 | 1.1 | 0.9 |
| 3/4 | 3.7 | 3.2 | 1.6 | 1.3 |
| 1 | 4.8 | 4.2 | 2.1 | 1.7 |
| 1-1/2 | 6.9 | 6.0 | 3.0 | 2.4 |
| 2 | 7.8 | 6.8 | 3.4 | 2.7 |
| 3 | 11.0 | 9.6 | 4.8 | 3.9 |
| 5 | 17.5 | 15.2 | 7.6 | 6.1 |
| 7-1/2 | 25.3 | 22 | 11 | 9 |
| 10 | 32.2 | 28 | 14 | 11 |
| 15 | 48.3 | 42 | 21 | 17 |
| 20 | 62.1 | 54 | 27 | 22 |
| 25 | 78.2 | 68 | 34 | 27 |
| 30 | 92 | 80 | 40 | 32 |
| 40 | 120 | 104 | 52 | 41 |
| 50 | 150 | 130 | 65 | 52 |
| 75 | 221 | 192 | 96 | 77 |
| 100 | 285 | 248 | 124 | 99 |

## Single-phase FLA — Table 430.248

| HP | 115 V | 230 V |
|---|---|---|
| 1/2 | 9.8 | 4.9 |
| 1 | 16 | 8 |
| 2 | 24 | 12 |
| 3 | 34 | 17 |
| 5 | 56 | 28 |
| 7-1/2 | 80 | 40 |
| 10 | 100 | 50 |

## Worked example

A 10 HP, 3-phase, 230 V motor:

```
From Table 430.250: FLA = 28 A

Conductor min: 28 × 1.25 = 35 A
  → #8 Cu (40 A at 75°C, derated to 40 A at 75°C termination) ✓

BCP per Table 430.52:
  Inverse-time circuit breaker: 250% × 28 = 70 A
  Standard size: 70 A ✓

Overload (motor service factor 1.15):
  Per 430.32: 125% × 28 = 35 A
```

## Common errors

- Using nameplate FLA for conductor sizing (must use table)
- Using single-phase table for three-phase motor
- Forgetting the table is "FLA" not "ampacity" — these are different
