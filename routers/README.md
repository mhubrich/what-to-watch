# Routers

## Brief Summary
This directory contains the Express.js route handlers that define the various API endpoints for the application.

## Overview of Contents
- `router-auth.js`: Handles authentication routes (`/login`, `/logout`, `/auth/google/callback`) and session management.
- `router-movies.js`: Endpoints related to managing the movie list.
- `router-search.js`: Endpoints for searching for movies to add.
- `router-streaming.js`: Endpoints for retrieving streaming availability information (e.g., via JustWatch).

## Technical Details
- The routers use `express.Router()` to modularize the routing logic.
- `router-auth.js` integrates with Passport.js for Google OAuth 2.0 and sets up session storage using a DynamoDB session store.
- Protected routes are secured using the `isAuthenticated` middleware exported from `router-auth.js`.
