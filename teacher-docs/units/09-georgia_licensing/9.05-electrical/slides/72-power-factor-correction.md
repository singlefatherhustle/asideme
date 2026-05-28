# Power Factor and Correction

## What PF measures

```
PF = cos(φ) = True Power (W) / Apparent Power (VA)
```

PF ranges from 0.0 (purely reactive) to 1.0 (purely resistive).

- **Pure resistive load** (heater, incandescent): PF = 1.0
- **Motor at full load**: PF ≈ 0.85
- **Motor lightly loaded**: PF can drop to 0.5
- **Discharge lighting (fluorescent ballast)**: PF varies, typically 0.85-0.95
- **Modern electronic drives**: PF can be near 1.0

## The phase angle

In AC circuits with inductive components (motors, transformers, ballasts):

```
Voltage and current waveforms shift apart by angle φ
                              
Resistive load: V and I in phase     →  φ = 0°    →  PF = 1.0
Inductive load: I lags V by some φ    →  φ > 0°    →  PF < 1.0
Capacitive load: I leads V             →  φ < 0°    →  PF < 1.0 (leading)
```

## Why PF matters economically

```
True Power (kW): what the meter measures and you pay for
Apparent Power (kVA): what the utility transformer carries
Reactive Power (kVAR): the "wasted" component
```

The utility sizes transformers, conductors, and switchgear for **apparent power** (kVA). A factory with 100 kW load at 0.6 PF draws 167 kVA from the utility — even though only 100 kW does useful work. The utility built for the higher capacity but you're only paying for 100 kW.

## PF penalty

Most commercial / industrial utilities impose a PF penalty when PF drops below a threshold (commonly 0.90 or 0.95). The penalty appears as a rate adder on your bill.

For a facility with low PF and meaningful kW usage, the annual penalty can be **thousands of dollars**.

## Correction with capacitors

Capacitors generate leading reactive power that cancels the lagging reactive power from inductive loads. Apply capacitors:

- **At the load** (motor side) — most effective, also corrects the supply circuit
- **At the building service** — corrects the utility billing only
- **Switched in stages** — adjust based on PF measurement

## Sizing PF correction

```
Required kVAR = kW × (tan(φ_existing) − tan(φ_target))
```

For a 100 kW load at 0.80 PF, correcting to 0.95:

```
φ_existing = arccos(0.80) = 36.87°  → tan = 0.75
φ_target   = arccos(0.95) = 18.19°  → tan = 0.329

Required kVAR = 100 × (0.75 − 0.329) = 42.1 kVAR
```

Install a 50 kVAR capacitor bank for headroom.

## Common PF correction errors

- Over-correction (capacitor too large, leads to leading PF, voltage rise)
- Missing the discharge requirement (capacitors must self-discharge)
- Sizing for kW instead of kVAR
- Forgetting that VFDs / electronic drives change the PF profile (don't size for assumed traditional motor load)
