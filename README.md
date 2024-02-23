# HOKC Admin - Backend

## Description
This is the backend for the HOKC Attendance System. It is built using Node.js, Express.js, and PostgreSQL. It connects both the admin and user interfaces to the database.

## Installation
1. Clone the repository
2. Run `npm install` to install all the dependencies
3. Create a `.env` file in the root directory and add the following environment variables:
    - `PORT` - The port number for the server
    - `DB_USER` - The username for the PostgreSQL database
    - `DB_PASSWORD` - The password for the PostgreSQL database
    - `DB_HOST` - The host for the PostgreSQL database
    - `DB_PORT` - The port for the PostgreSQL database
    - `DB_DATABASE` - The name of the PostgreSQL database
    - `JWT_SECRET` - The secret key for the JSON Web Token
4. Run `npm run dev` to start the server

## App Specifications
- Node.js
- Express.js
- PostgreSQL (Knex.js)
- TypeScript
