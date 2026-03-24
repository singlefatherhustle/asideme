# Queries

## Asynchronous Programming (Async)

- start a potentially long running process (unknown time limit)
  - going and getting data from somewhere
  - reading a text file on your computer

## Event Loop (how does our code run)

- runs code from top to bottom
- if it hits an async call
  - trigger the call and continue to run the rest of the code
- when the async call finishes, it will be added to the Callback Queue
- once there is no other code to run, it'll start running the code from the callback queue

## API (Application Programming Interface)

- allows our Front-End code to interact with code outside of our Front-End (servers)
- CRUD (Create, Read, Update, Delete)
  - The basic functions of most servers and websites
- HTTP Methods
  - GET - retrieve data (READ)
  - POST - add data (CREATE)
  - PUT/PATCH - update data (UPDATE)
  - DELETE - remove data (DELETE)
- base URL
  - the START of the URL that is required to call the server that you want information from
  - WHERE I want to call
- endpoint
  - the part of the URL that comes after the base URL that will tell the server which information you need
  - WHAT information I want

## How to make Asynchronous calls

- 2 ways to handle an asynchronous call
  - callback functions (OLD WAY)
    - callback hell
    - pyramid of doom
  - Promise - cleaner
    - object that has a status and value
      - pending - has not finished yet
      - fulfilled - call succeeded
      - rejected - error
    - async / await
      - await waits for the async call to finish before moving on
      - await can only be used inside of async functions
      - use .json() to turn the Response into data
    - fetch - used to call an outside source

## Try / Catch

- try -> attempt to run some code
- catch -> if the try throws an error, what should we do now
