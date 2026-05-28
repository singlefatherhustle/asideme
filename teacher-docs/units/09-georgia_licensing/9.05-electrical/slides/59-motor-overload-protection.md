# Motor Overload Protection (NEC 430 Part III)

## What overload protects against

Sustained current modestly above FLA — typically caused by:

- Bearing wear / mechanical drag
- Voltage too low (motor compensates with current)
- Phase loss (single-phasing on a 3Ø motor)
- Continuously stalled rotor

Overload protection trips on a TIME-CURRENT curve, allowing brief inrush during start.

## Sizing — 430.32

Standard sizing uses the **motor nameplate FLA** (not table FLA):

| Motor type | OL rating |
|---|---|
| **Service factor 1.15 or higher** | 125% × nameplate FLA |
| **Temp rise 40°C or less** | 125% × nameplate FLA |
| **All other motors** | 115% × nameplate FLA |

## Where overload protection sits

OLs are typically integrated into the **motor controller**:

- Magnetic starters with heater elements (older)
- Solid-state overloads with adjustable trip (modern)
- Built-in overload for small motors (fractional HP)

Heater element selection charts come from the starter manufacturer based on motor nameplate.

## Worked example

```
10 HP, 3Ø, 230 V motor:
  Nameplate FLA = 26 A (slightly lower than table 28)
  Service factor: 1.15

  Overload set point = 26 × 1.25 = 32.5 A

Use a heater element rated ~32-33 A.
The OL will trip on 32.5 A sustained but ride through start-up inrush.
```

## Adjustment after install — 430.32(C)

If the initial setting trips on motor start (false trip on inrush):

- May increase OL setting up to **140%** of nameplate FLA (SF ≥ 1.15)
- May increase OL setting up to **130%** of nameplate FLA (SF < 1.15)

You cannot increase beyond these limits — at that point, you need a larger motor or to investigate why start-up is so heavy.

## Single-motor branch with no separate OL — 430.42

Small motors (e.g., room fans, residential exhaust):

- If branch-circuit OCPD ≤ 20 A and motor is ≤ 1 HP, the branch breaker may serve as OL
- For motors > 1 HP, separate OL is required

## Common OL errors

- Using table FLA (nameplate FLA is correct for OL setting)
- Forgetting to check service factor on nameplate
- Setting OL too high in response to nuisance trip without investigating cause
- Using a non-listed OL device for the motor type
