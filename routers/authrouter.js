const express = require("express");
const passport = require("passport");
const config = require('config');
const GoogleStrategy = require("passport-google-oauth20").Strategy;


passport.use(new GoogleStrategy({
        clientID: config.get("google-oauth20.clientId"),
        clientSecret: config.get("google-oauth20.clientSecret"),
        callbackURL: config.get("google-oauth20.callbackURL")
    },
    (accessToken, refreshToken, profile, done) => {
        console.log("VERIFY", profile);
        return done(null, { id: profile.id, name: getName(profile) });
    }
));

passport.serializeUser((user, done) => {
    console.log("SERIALIZE USER", user)
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log("DESERIALIZE USER", user);
    done(null, user);
});

function getName(profile) {
    if (profile.hasOwnProperty("name") && profile.name.hasOwnProperty("givenName")) {
        return profile.name.givenName;
    }
    if (profile.hasOwnProperty("displayName")) {
        return profile.displayName;
    }
    return "Unknown User";
}

const authRouter = express.Router();

// Redirect the user to the OAuth provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
authRouter.get("/login", passport.authenticate("google", { scope: ["profile"] }));

authRouter.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Successful authentication, redirect home.
        console.log("AUTHENTICATION SUCCESSFUL", req.user);
        res.redirect("/");
    }
);

authRouter.get("/logout", (req, res, next) => {
    console.log("LOGOUT", req.user);
    req.logout(err => {  // logout of passport
        req.session.destroy(err => { // destroy the session
            res.redirect("/");
        });
    });
});

authRouter.get("/test", isAuthenticated, (req, res, next) => {
    console.log("TEST", req.session);
    res.send('User authenticated');
    next();
});

function isAuthenticated(req, res, next) {
    if (!req.user) return res.status(401).send("No Access");
    next();
}


module.exports = { authRouter, isAuthenticated };