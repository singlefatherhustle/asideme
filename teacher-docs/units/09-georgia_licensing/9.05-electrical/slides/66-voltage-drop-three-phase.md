# Voltage Drop — Three Phase

## The three-phase formula

```
VD = (√3 × K × I × L) / CM
   = (1.732 × K × I × L) / CM
```

Where:
- VD = voltage drop (volts)
- √3 = three-phase factor (replaces the "2" from single-phase round-trip)
- K = 12.9 for copper, 21.2 for aluminum
- I = current (line amps)
- L = one-way length (feet)
- CM = circular mils

The math is similar but the **2** is replaced by **√3**. Why? Three-phase has three conductors and the math accounts for the geometric relationship between them.

## Worked example

```
A 50 A three-phase load at 480 V, 200 ft away, on #6 Cu:

   VD = (1.732 × 12.9 × 50 × 200) / 26,240
   VD = 223,428 / 26,240
   VD = 8.5 V

   Drop percentage: 8.5 / 480 = 1.77%   ✓ under 3%
```

## Quick comparison single-phase vs three-phase

```
SINGLE PHASE:  VD = (2 × K × I × L) / CM     (factor: 2)
THREE PHASE:   VD = (1.732 × K × I × L) / CM (factor: 1.732)
```

For the same wire and same length, three-phase has slightly less voltage drop because the math factor (1.732) is less than 2.

## When to use which

| Service | Formula |
|---|---|
| 120 V or 240 V residential branch | Single-phase formula |
| 120/208 V or 277/480 V three-phase feeders | Three-phase formula |
| 240 V three-phase delta | Three-phase formula |

## Same example, single-phase comparison

```
Same 50 A load if it were single-phase 240 V at 200 ft on #6 Cu:

   VD = (2 × 12.9 × 50 × 200) / 26,240
   VD = 258,000 / 26,240
   VD = 9.8 V

   Drop percentage: 9.8 / 240 = 4.1%   ✗ over 3%
```

Three-phase at 480 V has lower drop in both volts and percentage — partly the formula factor, partly the higher voltage.

## Approximate quick check (rule of thumb)

For 480 V, 75°C copper, a conductor can carry its rated ampacity over distances approximately:

```
#10:  150 ft for full ampacity at 3% drop
#8:   240 ft
#6:   380 ft
#4:   600 ft
```

These are rough. For exam math, use the formula.

## Common voltage drop errors

- Using single-phase formula on three-phase circuit
- Wrong K value (using aluminum K for copper conductor)
- Forgetting to multiply by 2 for round-trip in single-phase
- Calculating "voltage drop" but expressing it as a percent of conductor resistance instead of source voltage
