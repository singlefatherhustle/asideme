# Airflow Measurement

## Why measure airflow

Manufacturer's published capacity assumes correct airflow. Wrong airflow = wrong capacity, wrong dehumidification, wrong efficiency.

Common targets:

```
Cooling: 400 CFM/ton (standard)
         350 CFM/ton (high-humidity climates)
         450 CFM/ton (low-latent / high-altitude)

Heating: typically 400-450 CFM/ton
```

## Tools for measurement

| Tool | Use |
|---|---|
| **Anemometer** | Measure air velocity at register (then × area = CFM) |
| **Hot wire anemometer** | More accurate; used for measurements |
| **Capture hood** | Place over register, displays CFM directly |
| **Manometer** | Indirect (via TSP and equipment curves) |
| **Pitot tube** | For duct traverse in commercial systems |

## Capture hood method

For residential commissioning:

```
1. Place capture hood completely over the supply register
2. Read CFM directly on the display
3. Repeat for each register
4. Sum all register CFMs = total system airflow
5. Compare to design CFM
```

This is the most accurate field method for total system airflow verification.

## Anemometer method (traverse)

For ducts without removable cover:

```
1. Drill traverse hole in duct
2. Insert anemometer at multiple points across the duct cross-section
3. Average the readings
4. Multiply by duct cross-sectional area
5. Get CFM
```

Less accurate than capture hood but useful for in-line measurements.

## Total external static pressure method

For experienced techs:

```
1. Measure TSP (total static pressure)
2. Look up corresponding CFM on equipment performance curve
3. CFM established without measuring at registers
```

Less direct but quick. Manufacturer's curve must be specific to the equipment model.

## What too little airflow looks like

```
Symptoms:
- Indoor coil ices up
- Refrigerant returns wet (slugging compressor)
- High superheat readings
- Low subcooling
- Customer complaints about lukewarm air

Causes:
- Dirty filter
- Blocked return air
- Crushed ductwork
- Wrong blower speed setting
- Closed dampers
- Undersized return ducts
```

## What too much airflow looks like

```
Symptoms:
- High humidity (not enough latent removal)
- Cool air feels clammy
- Low superheat readings
- High subcooling

Causes:
- Wrong blower speed setting (too fast)
- Bypass dampers stuck open
- Improperly tuned ECM motor settings
```

## Balancing the system

When some rooms are hot/cold:

```
1. Measure CFM at each register
2. Identify rooms getting too much/too little
3. Adjust balance dampers in the branch ducts
4. Re-measure and verify
5. Tag dampers in their final position
```

Most residential systems are unbalanced from installation. A 30-minute balance call dramatically improves comfort.

## Documentation

For permitted installations:

```
Commissioning report includes:
- Total system CFM measured
- CFM per room
- TSP measurement
- Blower speed setting
- Static pressure across each component
- Charge weight or subcooling/superheat reading
```

This documents proper installation for the AHJ and for warranty purposes.

## Common airflow errors

- Skipping airflow measurement entirely (just assuming based on spec)
- Measuring at register but not knowing room CFM target
- Using anemometer without traverse procedure
- Forgetting to verify with capture hood at suction-side as well
- Not adjusting dampers when imbalance is found
