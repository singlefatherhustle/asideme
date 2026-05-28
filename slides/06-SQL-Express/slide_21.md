# API and Database Architecture Diagram

## Overview
This diagram illustrates the flow of a POST request for paintings through an Express.js API to a PostgreSQL database.

## API Section (Left Side)

### Components

**Client**
- Label: 2
- Sends POST request

**POST /paintings**
- Endpoint for creating paintings
- Label: 2

**Express app**
- Label: 1
- Central application server

**Middleware Stack**
1. logging middleware
2. body-parsing middleware

**POST /paintings endpoint**
- Label: 3
- Returns response

**Painting object (201 Created)**
- Label: 4
- Response payload with status code 201

**POST / endpoint**
- Label: 5 (dashed box - optional/alternative)

**GET / endpoint**
- Label: 5 (dashed box - optional/alternative)

## Database Section (Right Side)

### Components

**createPainting**
- Label: B (dotted box)
- Function that creates painting records

**pg** (node-postgres)
- Label: 6 (red highlight)
- PostgreSQL client library

**INSERT INTO paintings**
- SQL operation
- Label: 6 (red arrow)

**PostgreSQL**
- Database management system
- Receives INSERT query

**Database**
- Physical storage
- Label: 7 (dotted box reference)

### Tables

**painting** table (left)
- Stores painting records
- Connected via dashed line from API

**painting** table (right, green)
- Referenced in Database section
- Label: B (dotted box)

## Flow Summary

1. Client sends POST request to /paintings
2. Express app processes through logging and body-parsing middleware
3. Request handled by /paintings endpoint
4. Returns 201 Created response with painting object
5. createPainting function triggered
6. pg library executes INSERT INTO paintings query
7. Data persisted in PostgreSQL Database

## Labels Reference

| Label | Component |
|-------|-----------|
| 1 | Express app |
| 2 | Client and POST /paintings |
| 3 | POST /paintings endpoint response |
| 4 | 201 Created response |
| 5 | Alternative POST/GET endpoints (optional) |
| 6 | pg and INSERT operation (red highlight) |
| 7 | Database reference (dotted) |
| B | Database section (dotted) |