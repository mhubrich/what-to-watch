# Utilities

## Brief Summary
This directory contains domain models, utility functions, and helper classes used throughout the application to manage data structures.

## Overview of Contents
- `movie.js`: Defines the `Movie` and `MovieType` classes representing a movie object.
- `record.js`: Defines the `Record` and `RecordMeta` classes, wrapping a movie with user and tracking metadata.
- `tree-query.js`: Provides utility functions for traversing or querying tree-like data structures.

## Technical Details
- These classes function as data transfer objects (DTOs) heavily used when converting data back-and-forth between the frontend, the server, and the DynamoDB storage layer.
