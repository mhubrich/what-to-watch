# Strategies

## Brief Summary
This directory contains the authentication strategies used by Passport.js to secure the application.

## Overview of Contents
- `strategy-google.js`: Implements the Google OAuth 2.0 strategy framework.

## Technical Details
- Implements `passport-google-oauth20` to authenticate users via their Google accounts.
- Includes a whitelist mechanism (`config.get("strategy.google.whiteList")`) to restrict access to only a predefined list of authorized Google account IDs.
- Provides a wrapper class `StrategyGoogle` with a factory method to initialize the strategy using configuration values.
