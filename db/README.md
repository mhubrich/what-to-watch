# Database Subsystem

## Brief Summary
This directory contains the data access layer components that handle the connection and interactions with the database.

## Overview of Contents
- `db-movies.js`: Contains the `DBMovies` class which encapsulates CRUD operations for the movies table.
- `db-users.js`: Contains functionality for managing user/session data storage.
- `createtables.js`: A script or module used to provision and create the necessary DynamoDB tables.

## Technical Details
- The application uses **AWS DynamoDB** as its data store, accessed via the `aws-sdk`.
- `DBMovies` provides methods like `getAll()`, `add()`, and `remove()` and handles the marshalling and unmarshalling between DynamoDB JSON structures and the application's domain models (`Record`, `Movie`).
- Reads configuration values for AWS Region, Access Keys, and Table Names dynamically using the `config` module.
