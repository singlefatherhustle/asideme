# Capacitors (NEC Article 460)

## What a capacitor does in a building

Power factor correction. Inductive loads (motors, fluorescent ballasts) draw "reactive power" that doesn't do real work but loads the utility transformer. Capacitors counter this.

## Why care about power factor

```
True power (kW) — does the work
Apparent power (kVA) — total demand on the utility
Power factor = kW / kVA

If kW = 80, kVA = 100, PF = 0.80
                              80% efficiency
```

Utilities charge for low power factor (below ~0.95) on commercial accounts via a "power factor penalty."

Capacitor banks installed at the service or on individual motors push PF back toward 1.0.

## Sizing — 460.3

Capacitor banks are sized in kVAR (kilovolt-amperes reactive):

```
Required correction kVAR = kW × (tan φ_old − tan φ_new)

Where φ is the angle whose cosine is the power factor.
```

For a 100 kW load at 0.80 PF, correcting to 0.95 PF:

```
φ_old = arccos(0.80) = 36.87°  → tan = 0.75
φ_new = arccos(0.95) = 18.19°  → tan = 0.329

Required: 100 × (0.75 − 0.329) = 42.1 kVAR
```

## Discharge requirement — 460.6

Capacitors must have a means to discharge stored energy:

| Voltage | Time to ≤ 50 V |
|---|---|
| ≤ 600 V | 1 minute |
| > 600 V | 5 minutes |

This is via internal discharge resistors. Disconnecting a capacitor doesn't make it safe — it can still hold lethal charge.

## Disconnecting means — 460.8

Capacitor banks must have a disconnect:

- Within sight of the capacitor
- Or capable of being locked open at the supply

## OCPD — 460.8(B)

Capacitor branch conductors must have OCPD sized at 135% of capacitor rated current.

## Common capacitor errors

- No bleeder resistor or discharge means
- Disconnect not within sight
- Conductor sized to OCPD rather than 135% of capacitor current
- Missing safety labels warning of stored charge
