/**
 * Express Router that configures routes
 * 1) GET /login
 * 2) GET /auth/google/callback
 * 3) GET /logout
 */
const express = require("express");
const passport = require("passport");


// Creates an Express Router which is later exported as a module
const loginRouter = express.Router();

// Redirects the user to the OAuth provider for authentication
loginRouter.get("/login", passport.authenticate("google", { scope: ["profile"] }));

// When authentication complete, the provider will redirect the user
// back to the application at this route
loginRouter.get("/auth/google/callback",
    passport.authenticate("google", { successRedirect: "/", failureRedirect: "/login" })
);

// Calling logout will clear both user and session information, and redirect the user
loginRouter.get("/logout", (req, res, next) => {
    // Logout of passport (removes `user` property from `req`)
    req.logout(err => { 
        // Destroy the session (removes `session` property from `req`)
        req.session.destroy(err => res.redirect("/"));
    });
});


module.exports = loginRouter;