## Functions - block of code that will execute a given task

- just a set of directions
- can re-used throughout your code and can be called when something triggers it (like a button click!)
- two ways to write a function
  - function nameOfFunction() { code here } (ES5)
  - const nameOfFunction = () => { code here } (ES6 / Arrow Functions)
  - how to invoke (run) a function -> nameOfFunction();

## Parameters and Arguments

- parameters are in the function definition and act as a placeholder for values
- arguments are the real values that are passed into the function invocation

## The return keyword

- ONLY used in functions
- what the function sends back to whatever called it
- once you return, the function stops

## Scope - when/where can I use a variable

- Where a variable can be used is based on where it is defined
- A variable can be used if it is defined at an equal or higher level
  - Global (highest) -> variable will be available anywhere
  - Functional -> variable can be used with the function that defined it
  - Block (lowest) => variable can be used with curly braces
