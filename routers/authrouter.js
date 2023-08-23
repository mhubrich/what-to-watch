/**
 * Express Router that configures 
 * 1) Authentication with Google OAuth 2.0
 * 2) Login session management
 * 3) Session storage
 */
const express = require("express");
const session = require('express-session');
const passport = require("passport");
const config = require("config");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const DBUsers = require("../db/db-users");


// Creates an Express Router which is later exported as a module
const authRouter = express.Router();

// Sends back a site verification code to enable domain authorization (Google OAuth2)
authRouter.get("/", (req, res, next) => {
    res.send(config.get("auth-provider.google.siteVerification"));
});

// Configures session storage on DynamoDB
authRouter.use(session({
    secret: config.get("session.secret"),
    resave: false, 
    saveUninitialized: false,
    store: DBUsers.createInstance()
}));

// Enable session authentication
authRouter.use(passport.initialize());
authRouter.use(passport.session());

// Configure the Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
        clientID: config.get("auth-provider.google.clientId"),
        clientSecret: config.get("auth-provider.google.clientSecret"),
        callbackURL: config.get("auth-provider.google.callbackURL")
    },
    (accessToken, refreshToken, profile, done) => {
        return done(null, { id: profile.id, name: getName(profile) });
    }
));

// Serialize user information to the session store
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user information from the session store
passport.deserializeUser((user, done) => {
    done(null, user);
});

/**
 * Helper to obtain a display name from the given profile.
 * @param {Object} profile  Profile obtained by the identity provider.
 * @return {String}         Display name of the user.
 */
function getName(profile) {
    if (profile.hasOwnProperty("name") && profile.name.hasOwnProperty("givenName")) {
        return profile.name.givenName;
    }
    if (profile.hasOwnProperty("displayName")) {
        return profile.displayName;
    }
    return "Unknown User";
}

/**
 * Middleware function to verify if user is authenticated.
 * @param {Request} req     Request object.
 * @param {Response} res    Response object.
 * @param {Function} next   Callback to invoke the next middleware function.
 * @return {Object}         Response with status code 401 if user is not authentication,
 *                          invokes the callback `next` otherwise.
 */
function isAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).send("No Access");
    next();
}


module.exports = { authRouter, isAuthenticated };