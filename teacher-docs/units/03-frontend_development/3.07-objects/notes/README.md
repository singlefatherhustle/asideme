# Objects

- allow us to use KEYS and VALUES to store information in one variable
- const objectName = { keyName: value, keyName2: value2 }
- keys are properties, values can be ANY data type
- similar to arrays, but we name the indexes when we make an object

## Manipulating Objects - Read / Add / Update

- dot notation (most common) - only works if you know the key
  - objectName.keyName (can not use variables for the key name)
- bracket notation
  - objectName[keyName] (can use variables)

## Delete

- delete objectName.keyName
- delete objectName[keyName]

## Looping

- for..in 
- for(const key in objectName) { code }

## Keys and Values

- Object.keys(objectName) -> array with all of the keys in it
- Object.values(objectName) -> array with all of the values in it
