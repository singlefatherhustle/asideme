# Ohm's Law

## The fundamental relationship

```
E = I × R
```

Where:
- **E** = voltage (volts)
- **I** = current (amps)
- **R** = resistance (ohms, Ω)

## The Ohm's Law triangle

```
            ┌──────┐
            │  E   │
            ├──┬───┤
            │ I│ R │
            └──┴───┘
```

To solve:

```
E = I × R     (covering E)
I = E / R     (covering I)
R = E / I     (covering R)
```

## Worked examples

```
Find current:
   240 V applied to 24 Ω resistance
   I = 240 / 24 = 10 A

Find voltage:
   2 A through 10 Ω
   E = 2 × 10 = 20 V

Find resistance:
   120 V producing 12 A
   R = 120 / 12 = 10 Ω
```

## When Ohm's Law applies

- **DC circuits** — always
- **AC purely resistive loads** — always (heaters, incandescent bulbs)
- **AC with reactance** (motors, transformers, capacitors) — Ohm's Law applies to **impedance (Z)**, not just resistance

For AC with reactance:
```
E = I × Z
where Z = √(R² + X²)  (impedance is the magnitude of resistance + reactance)
```

## Connection to power

```
P = E × I   (power, in watts)

Substituting Ohm's Law:
P = I² × R
P = E² / R
```

## Practical use

```
A 100 W incandescent bulb at 120 V:
   I = P / E = 100 / 120 = 0.83 A
   R = E / I = 120 / 0.83 = 144 Ω (when bulb is hot)
```

```
A motor drawing 10 A at 240 V on a 15-ohm circuit:
   Voltage at motor: E = I × R
   Wait — that's not Ohm's Law applied right.
   
   Ohm's Law to find voltage DROP across the 15-ohm conductor:
   V_drop = 10 × 15 = 150 V (impossible — circuit can't have more drop than source)
   
   This means: the circuit's actual resistance is far less than 15Ω.
   The motor itself has impedance limiting current.
```

## Common Ohm's Law errors

- Confusing voltage with voltage drop
- Treating AC loads as if they have only pure resistance
- Forgetting unit consistency (kV vs V, mA vs A)
- Trying to apply to a single component when the circuit has multiple paths
