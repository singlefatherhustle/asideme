# Motor Controllers (NEC 430 Part VII)

## What a controller does

A motor controller is the device that starts and stops the motor. Common types:

| Type | Description |
|---|---|
| **Manual starter** | Toggle / lever, contacts close to start motor |
| **Magnetic starter** | Contactor with thermal overload built in; coil energized by control circuit |
| **Combination starter** | Disconnect + fuse + magnetic starter in one enclosure |
| **Soft starter** | Solid-state device that ramps voltage up to reduce inrush |
| **Variable Frequency Drive (VFD)** | Electronic speed control |
| **Across-the-line** | Full voltage start; standard for most installations |

## Ratings — 430.83

A controller must have horsepower rating ≥ the motor it controls. Heavy-duty industrial applications often use combination starters rated for the largest motor expected on the circuit.

## Magnetic starter components

```
                    L1 ─ ─ ─ ─ ─ ┐
                    L2 ─ ─ ─ ─ ─ ┤  Power conductors
                    L3 ─ ─ ─ ─ ─ ┘
                       │
                  ┌────┼────┐
                  │ Contactor │  ← coil energized = contacts close
                  └────┬────┘
                       │
                  ┌────┼────┐
                  │  Overload │  ← heater elements + bimetal
                  └────┬────┘
                       │
                    T1, T2, T3 ─ to motor
```

## Control circuit

```
   L1 ──┬─────────────────────────┐
        │                           │
       Start (NO)               Stop (NC)
        │                           │
        │   Holding contact         │
        ├──╢ ╟─────────────────────│
        │                           │
        └─── Contactor coil ────────┘
                                    │
                                  L2 / N
```

When Start is pressed → coil energizes → contactor closes → motor runs → holding contact keeps coil energized after Start is released. Stop interrupts the circuit.

## Where the controller goes

The controller must be:

- Within sight of the motor, OR
- Capable of being locked open at the controller location

Within sight = visible from the motor location AND not more than 50 feet distant.

## Reversing starters

For motors needing forward / reverse control:

- Two contactors (forward + reverse) interlocked so only one can be on at a time
- Mechanical interlock + electrical interlock (NC contact of opposite coil)
- Both feed the same motor; phases swap on one direction

## Common controller errors

- Controller HP rating < motor HP
- Missing OL elements (heaters not sized correctly)
- No emergency stop where one is required (e.g., conveyor, industrial machinery)
- Controller not within sight of motor with no locking provision
