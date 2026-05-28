# Transformers (NEC Article 450)

## What a transformer does

Converts AC voltage from one level to another. Common uses:

| Type | Use |
|---|---|
| **Step-down** | 480 V → 208 V or 240 V → 120/240 V |
| **Step-up** | Rare in buildings; common in utility distribution |
| **Isolation** | Same voltage in and out; for electrical separation |
| **Buck-boost** | Adjust voltage up or down by a small amount (e.g., correct sag) |

## Sizing

Transformers are rated in **kVA** (kilovolt-amperes), the AC equivalent of watts. Common ratings:

| kVA | Single-phase amps @ 240 V secondary |
|---|---|
| 5 | 21 A |
| 10 | 42 A |
| 15 | 63 A |
| 25 | 104 A |
| 50 | 208 A |
| 75 | 313 A |
| 112.5 | 469 A |

## Primary and secondary protection — 450.3

For transformers > 600 V primary:
- Primary OCPD ≤ 250% of primary rated current (or 300% w/ secondary protection)

For transformers ≤ 600 V (most commercial):
- Primary OCPD ≤ 125% of primary rated current
- Smaller primary protection allowed if secondary has appropriate OCPD

## Ventilation — 450.9

Dry-type transformers depend on air circulation:

- 6-inch clearance to combustibles for transformers < 35 kV
- Clear ventilation grilles
- Cannot be in a closed-up enclosure that traps heat

## Working space — 450.13

Same as 110.26 working space rules. For larger transformers (> 600 V), additional dedicated space and accessibility requirements apply.

## Grounding the secondary

A transformer secondary is a **separately derived system**:

- Must have its own grounding electrode connection (or per 250.30 alternatives)
- Neutral bonded at the transformer or first downstream disconnect
- Equipment grounding conductor extends from transformer enclosure to downstream loads

## Common transformer applications

```
Commercial building service:
  Utility 480 V ─→ Building service ─→ Main 480 V panel
                                         │
                                         └─→ 30 kVA dry-type transformer ─→ 120/208 V panel
                                                                         (lighting, receptacles)
```

## Common transformer errors

- Installing in enclosed space without ventilation
- Missing primary OCPD sizing per 450.3
- Failing to ground the secondary as separately derived system
- Inadequate working clearance
