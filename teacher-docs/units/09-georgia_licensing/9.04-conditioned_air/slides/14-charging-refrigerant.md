# Charging Refrigerant Systems

## The two charging methods

| Method | When to use |
|---|---|
| **Subcooling** | Standard for fixed-orifice (TXV-less) and TXV systems with proper charge |
| **Superheat** | Used for systems with fixed orifice (capillary tube, piston) |

Most modern AC systems use TXV (Thermostatic Expansion Valve) and are charged by **subcooling**.

## Subcooling charging

```
1. Connect gauge set to high-side service port
2. Read high-side pressure → convert to saturation temperature
3. Measure liquid line temperature at outlet of outdoor coil
4. Calculate subcooling: Saturation temp - Liquid temp
5. Compare to manufacturer specification (typically 8-12°F)
```

If subcooling is **low**: low refrigerant charge, add refrigerant.
If subcooling is **high**: overcharged, remove refrigerant.

## Superheat charging (fixed orifice)

```
1. Connect gauge set to low-side service port
2. Read low-side pressure → convert to saturation temperature
3. Measure suction line temperature at evaporator outlet
4. Calculate superheat: Suction temp - Saturation temp
5. Compare to manufacturer specification (typically 8-15°F at design conditions)
```

If superheat is **low**: too much refrigerant, remove.
If superheat is **high**: too little refrigerant, add.

## Other indicators

```
Outdoor unit running but no cool air inside:
   - Possible empty refrigerant charge
   - Or compressor failure
   - Or fan motor failure
   - Or low airflow

Frosting on indoor coil:
   - Low refrigerant
   - Low airflow
   - Restricted return air

Frosting on outdoor coil (heat pump in heating):
   - Normal in some weather (defrost will handle)
   - Or low refrigerant

Hot air from registers (cooling mode):
   - No refrigerant
   - Reversed thermostat wires (heating instead of cooling)
   - Heat strip energized in cooling
```

## Charge by weight (verification)

For new installations:

```
1. Evacuate entire system to 500 microns
2. Weigh refrigerant into the system per manufacturer specification
3. Account for line set length (longer line sets need more refrigerant)
4. Document final weight added
```

Standard installation charge:

- Manufacturer specifies "X lbs of refrigerant for first 15 feet of line set"
- Add "Y ounces per additional foot"
- For 25-ft line set on 3-ton condenser: 5 lbs 8 oz, for example

Charge by weight is more accurate than charge by subcooling on first install.

## Common charging errors

- Adding refrigerant before diagnosing the leak ("topping off")
- Charging during cool conditions (subcooling reads incorrectly)
- Charging too quickly (compressor may slug liquid)
- Not recovering refrigerant before service (illegal venting)
- Confusing R-22 and R-410A gauge readings (different pressures at same temperatures)

## Pressure curves

Important reference data:

```
R-22 at 95°F outdoor:
   Suction (low side): 70-75 psig
   Discharge (high side): 260-285 psig

R-410A at 95°F outdoor:
   Suction: 120-130 psig
   Discharge: 380-410 psig
```

R-410A operates at higher pressures than R-22. Equipment, gauges, and recovery cylinders are NOT interchangeable.

## Best practice

For service calls reporting "not cooling":

```
1. Check filter — replace if needed
2. Check outdoor unit operation — listen for compressor
3. Check airflow — should feel cool air from registers
4. Connect gauges only after visual inspection
5. Calculate subcooling/superheat
6. Diagnose root cause (leak, dirty coil, etc.)
7. Fix root cause, then recharge correctly
```

Never just "add a couple pounds" — it's both unprofessional and likely illegal venting.
