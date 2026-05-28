# Motor Circuit Overview (NEC Article 430)

## The five components of a motor circuit

```
Source ──[BCP]──[Disc]──[BCC]──[Controller]──[OL]── Motor
           │      │       │        │           │
           │      │       │        │           └── Overload protection (running)
           │      │       │        └── Motor controller (switch/contactor)
           │      │       └── Branch-circuit conductors
           │      └── Motor disconnect (within sight)
           └── Branch-circuit protection (short-circuit + ground-fault)
```

## Each device's job

| Device | Function |
|---|---|
| **Branch-circuit protection (BCP)** | Trips on short circuit or ground fault |
| **Disconnect** | Isolates motor from source (manual) |
| **Branch-circuit conductors** | Sized for FLA + 125% |
| **Controller** | Starts and stops the motor (often a magnetic starter) |
| **Overload (OL)** | Trips on sustained over-current from running overload |

These are five SEPARATE protections, each addressing a different failure mode.

## Why overload and short-circuit protection are separated

- **Short-circuit** = catastrophic. Trip in milliseconds. Large interrupting capacity.
- **Overload** = gradual. Allow temporary overcurrent during motor starting (locked rotor + 6× FLA for 5-10 seconds). Trip on sustained.

A single OCPD can't do both because their trip curves are different. A standard breaker would trip on motor inrush; a thermal overload would be too slow on a short.

## Motor full-load current — Tables 430.247-250

The exam expects you to use NEC's **tables of motor full-load amps**, not the actual nameplate. The tables give the "design" FLA used for circuit sizing.

| HP | 1Ø 230 V | 3Ø 230 V | 3Ø 460 V |
|---|---|---|---|
| 1 | 8 A | 3.6 A | 1.8 A |
| 2 | 12 A | 6.8 A | 3.4 A |
| 5 | 28 A | 15.2 A | 7.6 A |
| 10 | 50 A | 28 A | 14 A |
| 25 | — | 68 A | 34 A |
| 50 | — | 130 A | 65 A |
| 100 | — | 248 A | 124 A |

Use the **table values** for sizing — not actual measured amps. This is a code requirement.

## Sequence of sizing

```
1. Look up FLA from NEC table (not nameplate)
2. Conductor: ≥ 125% of FLA  (430.22)
3. Overload: ≥ 115-125% of FLA, depending on service factor (430.32)
4. Branch-circuit protection: per 430.52 table (250-1100% of FLA, by device type)
```

## Common motor circuit errors

- Sizing conductors to nameplate instead of NEC table FLA
- Sizing BCP based on FLA instead of percentages in Table 430.52
- Missing the disconnect within sight of the motor
- Setting overload too high (won't trip on real overload condition)
