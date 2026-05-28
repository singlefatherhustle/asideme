# Real-Life Scenario — Troubleshooting Open Neutral

## The customer call

"Half the lights in my house went out, but the breaker isn't tripped. The lights that ARE on look weird — some brighter, some dimmer. Some appliances are making strange noises."

## What this almost certainly is

**Open neutral on the service or feeder**. The neutral conductor has lost continuity between the utility transformer and the building. Symptoms:

- Voltage between hot conductors and ground varies dramatically (can be 0V to 240V on a 120V circuit)
- Loads in parallel see voltage divider based on resistance — some get more voltage, others less
- LED bulbs may glow bright then dim
- Motor loads stall or burn out
- Some receptacles show 120V, some show 0V, some show 200V+

This is **extremely dangerous** for connected equipment. Customer should unplug everything immediately.

## Diagnostic steps

### Step 1 — Verify the symptom

```
Test voltage between:
   Hot leg 1 to neutral:   should be 120V, may read 200V+ or 0V
   Hot leg 2 to neutral:   should be 120V, may read 0V or 200V+
   Hot leg 1 to ground:    should be 120V — verify
   Hot leg 2 to ground:    should be 120V — verify
   Hot leg 1 to Hot leg 2: should be 240V — verify (this should be normal)
```

If Hot-to-Ground reads 120V on both legs but Hot-to-Neutral varies wildly: confirmed open neutral.

### Step 2 — Localize the break

Open neutral can be:

- **At the meter base** — corroded or loose neutral lug
- **At the panel** — neutral bar loose or damaged
- **In the service drop** — utility-side issue (call utility)
- **In a feeder** — between main panel and subpanel
- **In a branch circuit** — affects only that branch

Test from the supply side inward:
- Open the meter base — check neutral lug
- Open the main panel — check neutral connection at incoming SE cable
- If meter base and panel look good, the issue is in the service drop → utility problem

### Step 3 — If utility side

Notify the utility immediately. Linemen will:

- Pull the meter to isolate the building
- Inspect the service drop / lateral
- Replace damaged conductor or connection
- Restore service

Customer cannot legally make this repair themselves.

### Step 4 — If building side

The contractor can repair:

```
1. Shut off main breaker
2. Disconnect service (have utility kill service if working on the service)
3. Replace damaged conductor or terminal
4. Torque all neutral connections to spec
5. Re-test
6. Restore service
```

## Why this happens

- Age + corrosion at outdoor connections
- Loose neutral bus in old panel
- Squirrel / rodent damage on service drop
- Storm damage to weatherhead
- Old aluminum-to-copper splice degrading

## Why it's so destructive

Without a neutral:

- 120V loads see voltage based on which other 120V loads are also connected
- Light bulb on Leg 1 alone: sees full 240V → burns out
- TV on Leg 2 alone: sees 0V → no power
- Many appliances together: voltage divides unpredictably

In severe cases, multiple thousands of dollars of electronics burn out within seconds.

## Documentation

Customer should:

- Document burned-out equipment for insurance
- File a claim against the utility if service-side
- Get receipts for any contractor repair

## What the contractor learns

If the neutral was loose at the panel:
- Torque all bus connections regularly during PM
- Don't rely on visual — torque to spec

If neutral failed at service drop:
- Recommend regular weatherhead inspections in older homes
- Aluminum-clad services are particularly prone to corrosion at the drip loop
