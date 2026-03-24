# psql & more servers

## PostgreSQL (psql)

- database management software
- can hold multiple databases
- commands
  - \l -> list all of our databases
  - \c name -> connect to a database
  - \d -> display the tables in the database
  - \q -> exit psql

## pg package (postgres)

- allows us to communicate with the PostgreSQL software from our code
- client = communicating with
  - client.connect() -> open a connection to the DB
  - client.query() -> sends SQL statements to the DB
  - client.end() -> end a connection to the DB

## schema file - used to set up the tables for your DB

## seed file - file to create mock data in our DB that devs can use for testing (also demos)

- Creating Tables
  - SERIAL -> starts at the number 1 and goes up by one every time a new record is added
  - REFERENCES table_name(column) -> foreign keys
  - UNIQUE -> must be different from all other rows in this table
  - IF EXISTS -> won't throw an error if the table doesn't exist (used in dropping tables)

## DB Table Files (queries)

- contain functions that will be used by both the seed file and the server to talk to the DB
- when inserting or deleting, you can use "RETURNING *" to retrieve the row that was just added or deleted

## Servers cont.

- POST requests with a body MUST have app.use(express.json()) in order to read the body from the request
  - Postman -> raw JSON
- app.use -> middleware
  - used to catcha. request and do something with it before sending it to other routes or after next is called
