# Motor Disconnects (NEC 430 Part IX)

## The within-sight rule — 430.102

A disconnecting means must be located **within sight from** the motor location AND **within sight from** the driven machinery location.

Within sight = visible AND not more than 50 feet distant.

```
Motor location ──── ≤ 50 ft ──── Disconnect ──── ≤ 50 ft ──── Driven equipment
       ↑               (visible from both)               ↑
   Driven by motor                                    Powered equipment
```

## Exception — locked disconnect

If the disconnect isn't within sight, a disconnect **at the controller location** is acceptable IF:

- The motor disconnect can be locked open
- The lockout means is a listed device (not just a chain)
- AND the controller location disconnect is in addition to the BCP at the source

## Disconnect type — 430.109

The motor disconnect must:

- Open all ungrounded conductors of the motor
- Be a motor-circuit switch, molded-case switch, molded-case circuit breaker, fused disconnect, or unfused disconnect rated appropriately

| Motor HP | Disconnect type |
|---|---|
| Under 2 HP, fractional, portable | Cord-and-plug acceptable |
| 2-100 HP | Motor-circuit switch or breaker |
| Over 100 HP | Specific industrial-rated disconnect |

## Marking — 430.110

The disconnect must clearly indicate:

- Whether it is ON (closed) or OFF (open)
- Be readable while standing in front of the operator handle

## Ampere rating — 430.110

Disconnect rating ≥ 115% × motor FLA (from NEC table).

```
10 HP, 3Ø, 230 V motor: FLA = 28 A
Disconnect rating ≥ 28 × 1.15 = 32.2 A
Standard disconnect: 60 A motor-rated (next size up that includes 32.2 A)
```

## Type of disconnect:

- **Fusible disconnect**: combines disconnect and short-circuit protection. Common in industrial settings.
- **Unfused disconnect**: just the switch. Used when BCP is provided elsewhere (e.g., at the panel).

## Common disconnect errors

- Motor disconnect on the other side of a wall from the motor (not within sight)
- Disconnect rated for less than 115% of motor FLA
- Missing ON/OFF marking
- Cord-and-plug on a motor > 1/3 HP without a separate disconnect
- Locked-open lockout that's just a padlock through a generic chain (must be listed device)
