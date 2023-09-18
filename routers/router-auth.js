/**
 * Express Router that configures 
 * 1) Authentication with Google OAuth 2.0
 * 2) Login session management
 * 3) Session storage
 * 4) /login and /logout routes
 */
const express = require("express");
const session = require('express-session');
const passport = require("passport");
const config = require("config");
const DBUsers = require("../db/db-users");
const StrategyGoogle = require("../strategies/strategy-google");


// Creates an Express Router which is later exported as a module
const authRouter = express.Router();

// Configures session management and storage
authRouter.use(session({
    secret: config.get("session.secret"),
    resave: false, 
    saveUninitialized: false,
    cookie: {httpOnly: true, secure: true, sameSite: "strict"},
    store: DBUsers.createInstance()
}));

// Enable session authentication
authRouter.use(passport.initialize());
authRouter.use(passport.session());

// Set up the Google OAuth 2.0 strategy
passport.use(StrategyGoogle.createInstance());

// Serialize user information to the session store
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user information from the session store
passport.deserializeUser((user, done) => {
    done(null, user);
});

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

// Redirects the user to the OAuth provider for authentication
authRouter.get("/login", passport.authenticate("google", { scope: ["profile"] }));

// When authentication complete, the provider will redirect the user
// back to the application at this route
authRouter.get("/auth/google/callback",
    passport.authenticate("google", { successRedirect: config.get("app.home"),
                                      failureRedirect: config.get("app.domain") })
);

// Calling logout will clear both user and session information, and redirect the user
authRouter.get("/logout", (req, res, next) => {
    // Logout of passport (removes `user` property from `req`)
    req.logout(err => { 
        // Destroy the session (removes `session` property from `req`)
        req.session.destroy(err => res.redirect(config.get("app.home")));
    });
});

// Send back a site verification code to enable domain authorization (Google OAuth2)
authRouter.get("/", (req, res, next) => {
    res.send(config.get("strategy.google.siteVerification"));
});


module.exports = { authRouter, isAuthenticated };