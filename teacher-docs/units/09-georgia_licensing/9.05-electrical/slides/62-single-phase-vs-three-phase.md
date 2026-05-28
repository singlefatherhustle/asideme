# Single-Phase vs Three-Phase Motors

## What the difference is

**Single-phase** = power delivered on two wires (hot + neutral) at 60 Hz. The waveform peaks once per cycle.

**Three-phase** = power delivered on three wires (each 120° out of phase). The combined power delivery is constant rather than pulsed.

```
Single-phase:    ▲ ▽ ▲ ▽ ▲    ← power pulses (peaks per cycle)
                  
Three-phase:     ▲▲▲▲▲▲▲▲▲    ← three phases add to steady delivery
```

## Why three-phase is preferred for larger motors

- **Smoother torque** (no pulsation) → less mechanical wear
- **Higher efficiency** at higher horsepower
- **Self-starting** (no extra start winding needed)
- **Smaller physical size** for same horsepower
- **Lower current** for same power (P = √3 × V × I × PF for three-phase)

Most motors above 5 HP are three-phase in industrial / commercial settings.

## When you use single-phase

- Residential (no 3Ø service available in most homes)
- Small light-commercial appliances
- Motors under 5 HP where 3Ø isn't economical to provide

## Starting current

Single-phase motors need a **start winding** to get going:

- **Capacitor-start**: extra capacitor for high starting torque (compressors, well pumps)
- **Split-phase**: simpler design, lower torque (small fans)
- **Shaded-pole**: even simpler, low torque (small fans, motor-driven valves)

Three-phase motors start without external help — the rotating magnetic field is inherent.

## Power calculations

```
Single-phase:    P (watts) = V × I × PF
Three-phase:     P (watts) = √3 × V × I × PF
                 √3 ≈ 1.732
```

For the same load:

```
Single-phase 5 HP at 240V (PF 0.85):
   P = 5 × 746 = 3,730 W
   I = 3,730 / (240 × 0.85) = 18.3 A

Three-phase 5 HP at 240V (PF 0.85):
   P = 5 × 746 = 3,730 W
   I = 3,730 / (1.732 × 240 × 0.85) = 10.6 A
```

Three-phase requires 42% less current for the same horsepower. Smaller wire, smaller conduit, smaller everything downstream.

## Voltage choices

Common motor voltages:

| Type | Voltages |
|---|---|
| Single-phase | 120 V (small), 240 V (residential) |
| Three-phase | 208 V, 240 V, 480 V, 600 V |

Higher voltage = smaller current = smaller conductor. Industrial almost always uses 480 V or 575 V three-phase for motors above 10 HP.

## Common single vs three-phase errors

- Sizing 3Ø conductor with single-phase math (no √3 factor)
- Connecting a 3Ø motor to single-phase supply (won't start, will damage)
- Wiring 3Ø backwards (phase sequence wrong → motor turns wrong direction)
- Using single-phase voltage formulas for 3Ø power demand
