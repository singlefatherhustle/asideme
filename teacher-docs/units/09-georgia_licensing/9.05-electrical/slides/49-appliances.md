# Appliances (NEC Article 422)

## Branch circuit dedicated to one appliance

Many fixed appliances require their own dedicated branch circuit:

| Appliance | Typical circuit |
|---|---|
| Range | 50 A, 240 V dedicated |
| Wall oven | 30 A, 240 V dedicated |
| Cooktop | 40 A or 50 A, 240 V dedicated |
| Dryer (electric) | 30 A, 240 V dedicated |
| Water heater (electric) | 30 A, 240 V dedicated |
| Dishwasher | 20 A, 120 V dedicated (modern) |
| Garbage disposal | 20 A, 120 V dedicated |
| Refrigerator | 20 A, 120 V (small-appliance, sometimes dedicated) |
| HVAC outdoor unit | 30-60 A, 240 V dedicated |
| Sub-pump | 15 A or 20 A, 120 V dedicated |

## Continuous-use rule — 422.10

Appliances that run continuously (> 3 hr) require branch-circuit OCPD and conductors sized at **125%** of the appliance load.

Example:
```
Continuous fixed heater: 16 A
OCPD required: 16 × 1.25 = 20 A
Conductor required: at least 20 A rated
```

## Disconnecting means — 422.30

Every appliance must have a means of disconnection from all ungrounded conductors. Options:

- A unit switch that disconnects all ungrounded conductors when in the OFF position
- A separately-installed disconnect within sight of the appliance
- A panel breaker, if it can be locked OFF

## Cord-and-plug appliances — 422.16

A cord and plug may serve as the disconnecting means for cord-connected appliances. Specific requirements:

- Plug must be accessible (not behind the appliance permanently)
- Receptacle must be at least the rating of the appliance
- Cord must be appropriate length and type

## Water heaters

Electric water heaters typically:

- 30 A, 240 V dedicated circuit (4500W upper / 4500W lower elements)
- Disconnect within sight of the unit (or the breaker can be locked open)
- Hard-wired through 1/2" or 3/4" raceway

## Disposers and dishwashers

Modern code:

- Disposal: 20 A, 120 V dedicated; cord with plug acceptable
- Dishwasher: 20 A, 120 V dedicated; can be cord-connected (newer code)
- GFCI protection now required for both per 2023 NEC

## Common appliance errors

- Sharing a circuit between a dishwasher and disposer (each needs its own)
- Wiring a range / cooktop without a service disconnect within sight
- Cord-connecting a hard-wired appliance without a listed cord assembly
- Missing the 125% multiplier for continuous heating loads
