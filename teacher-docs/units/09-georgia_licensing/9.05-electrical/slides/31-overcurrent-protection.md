# Overcurrent Protection (NEC Article 240)

## What OCPDs do

Overcurrent protective devices (OCPDs) protect conductors and equipment from currents that exceed safe limits. Two kinds:

- **Overload** — current slightly above rated, sustained long enough to cause damage
- **Short circuit / ground fault** — sudden very high current from a fault

## Standard OCPD ratings — 240.6(A)

Memorize these standard sizes:

```
15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150,
175, 200, 225, 250, 300, 350, 400, 450, 500, 600, 700, 800, 1000,
1200, 1600, 2000, 2500, 3000, 4000, 5000, 6000
```

Used for: rounding up to "next standard size" when a calculation lands between.

## Round-up rule — 240.4(B)

When the ampacity of a conductor doesn't match a standard OCPD size, the **next higher** standard OCPD may be used IF all three conditions are met:

1. Conductor is not part of a multi-outlet branch circuit supplying receptacles for cord-and-plug-connected portable loads
2. Ampacity does not correspond to a standard rating
3. Next higher rating does not exceed 800 A

Example: calculated load 88 A → conductor ampacity 100 A → standard OCPD is 90 A or 100 A. Round up to 100 A breaker.

For OCPDs **over 800 A**, the conductor ampacity must match or exceed the OCPD rating without rounding up.

## Conductor protection — 240.4

A conductor is protected by an OCPD at its ampacity. Exceptions allow specific small-conductor cases:

- **#14 AWG**: 15 A max (regardless of insulation rating)
- **#12 AWG**: 20 A max
- **#10 AWG**: 30 A max

These small-conductor limits override the 90°C insulation table — you can't load a #12 to 30 A even if the THHN ampacity says so.

## Tap rules — 240.21

Short conductor segments may have an OCPD only at one end if they meet tap rules. Common taps:

- **10-foot tap**: conductor ≥ 10% of OCPD ampacity at supply; terminates in OCPD at the load end
- **25-foot tap**: conductor ≥ 1/3 of OCPD ampacity; terminates in OCPD
- **Outdoor tap**: any length if conductors are outside and OCPD is at the panel

Tap rules let you feed a sub-panel through a smaller conductor than the upstream OCPD without violating protection.

## Common OCPD mistakes

- Using a 30 A breaker on a #12 conductor (max 20 A per 240.4(D))
- Rounding up a 900 A calculation to 1000 A breaker on a 900 A conductor (only allowed ≤ 800 A)
- Confusing the conductor ampacity table with the small-conductor rule
