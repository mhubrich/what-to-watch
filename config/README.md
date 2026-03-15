# Configuration

## Brief Summary
This directory contains the configuration files for the application, defining environment-specific variables and secrets.

## Overview of Contents
- `default.json`: The primary configuration file containing active settings.
- `default-example.json`: A template demonstrating the required configuration structure and fields.

## Technical Details
- The application uses the standard npm `config` package to load configuration values.
- Configurations include AWS DynamoDB credentials, session secrets, Google OAuth 2.0 client IDs and secrets, and third-party API keys (like JustWatch).
- **Important**: Sensitive values (such as secrets and API keys) are stored here and the `default.json` file should never be committed to version control.
