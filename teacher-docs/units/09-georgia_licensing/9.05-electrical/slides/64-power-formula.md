# Power Formulas

## The basic power formula

```
P = E × I        (DC or pure resistive AC)
```

Where P = watts, E = volts, I = amps.

## Power wheel — all forms

```
           ┌─────────────────────┐
           │   P (watts)          │
           │                       │
           │  E × I    I² × R     │
           │  E² / R              │
           └─────────────────────┘
```

To find power, you can use:
- E × I (most common)
- I² × R (when you know current and resistance)
- E² / R (when you know voltage and resistance)

## AC vs DC vs three-phase

| System | Power formula |
|---|---|
| **DC** | P = E × I |
| **Single-phase AC** | P = E × I × cos(φ) = E × I × PF |
| **Three-phase AC** | P = √3 × E × I × cos(φ) = √3 × E × I × PF |

## Power factor

```
PF = cos(φ) = True Power (W) / Apparent Power (VA)
```

PF accounts for the phase difference between voltage and current in AC circuits with inductive or capacitive loads.

For pure resistive loads (heater, incandescent): PF = 1.0
For typical motors at full load: PF ≈ 0.85
For lightly-loaded motors: PF can drop to 0.5 or below

## Worked examples

### Single-phase resistive
```
A 1500 W toaster at 120 V:
   I = P / E = 1500 / 120 = 12.5 A
```

### Single-phase with motor (PF = 0.85)
```
A 2 HP single-phase motor at 240 V, PF 0.85:
   Output: 2 × 746 = 1492 W
   Apparent power: 1492 / 0.85 = 1755 VA
   I = 1755 / 240 = 7.3 A
```

### Three-phase
```
A 10 kW three-phase load at 480 V, PF 0.85:
   I = P / (√3 × E × PF)
   I = 10,000 / (1.732 × 480 × 0.85)
   I = 10,000 / 706.6
   I ≈ 14.1 A
```

## kVA vs kW

| Unit | What it represents |
|---|---|
| **kVA** | Apparent power; what the utility transformer carries |
| **kW** | True power; the work the load actually performs |

A 100 kVA load at 0.80 PF actually does 80 kW of real work.

Utilities size their equipment based on kVA. Customers are billed for kW (and sometimes a PF penalty).

## Common power formula errors

- Using DC formula on three-phase load (missing √3)
- Confusing apparent power (kVA) with true power (kW)
- Treating PF as 1.0 for motor circuits (motors typically 0.85)
- Forgetting unit conversion (746 W per HP)
