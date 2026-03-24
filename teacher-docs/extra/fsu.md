# Fullstack University

Welcome to Fullstack University! Your team has been hired to build a web platform that will allow the university to manage its academic departments and faculty.

## Overview

You should have two separate repositories: one for your frontend, and another for your backend. Your goal is to meet the requirements specified below.

## Requirements

### As a visitor, I want to be able to:

- view a list of all departments
- view a single department so I can see more details, such as:
  - name, description, images, contact info
  - list of faculty in the department
- view a list of all faculty
- view a single professor so I can see more details, such as:
  - name, bio, profile image, contact info
  - department this professor belongs to

## Milestones

While your team may tackle this project however you'd like, here are some suggested milestones to help guide your progress.

### Backend

- Define a database schema that captures all the necessary information
- Seed the database with dummy data
- Build API routes to serve the data
- Build API routes to add/remove records
- Build API routes to update existing records

### Frontend

- Build a wireframe for the frontend, along with example user interactions
- Set up React Router with empty pages
- Pages to view all departments and all faculty (dummy data)
- Pages to view details of a single department and faculty (dummy data)
- Build API query functions to get real data from your backend

## Administrator account

If you have extra time, try adding in edit functionality with an admin account!

- add a new department
- remove an existing department
- change the name, description, or banner image of an existing department
- add or remove professors to/from an existing department
- add a new professor
- remove an existing professor
- change the name, email, bio, or profile image of an existing professor
- change the department an existing professor belongs to

## Notes

### Cross-Origin Resource Sharing (CORS)

To allow your frontend to communicate with your backend running on port 3000:

1. Tell your frontend to send requests to `http://localhost:3000`.
2. Install `cors` in your backend.
3. Add the cors middleware near the top of your `app.js`, which allows any requests coming from `localhost`:
   ```js
   import cors from "cors";
   app.use(cors({ origin: /localhost/ }));
   ```
