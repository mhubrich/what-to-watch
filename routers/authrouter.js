const express = require("express");
const session = require('express-session');
const passport = require("passport");
const config = require("config");
const DynamoDBStore = require("dynamodb-store");
const GoogleStrategy = require("passport-google-oauth20").Strategy;


const authRouter = express.Router();

// Send back a site verification code to enable domain authorization (Google OAuth2)
authRouter.get("/", (req, res, next) => {
    res.send(config.get("auth-provider.google.siteVerification"));
});

// Configure session storage on DynamoDB
authRouter.use(session({
    secret: config.get("session.secret"),
    resave: false, 
    saveUninitialized: false,
    store: new DynamoDBStore({
        table: { name: config.get("database.users.table") },
        dynamoConfig: {
            accessKeyId: config.get("database.users.accessKeyId"),
            secretAccessKey: config.get("database.users.secretAccessKey"),
            region: config.get("database.users.region")
        },
        // Time to live = 1 day (removes any session data older than ttl)
        ttl: 86400000
    }),
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
        console.log("VERIFY", profile);
        return done(null, { id: profile.id, name: getName(profile) });
    }
));

// Serialize user information to the session store
passport.serializeUser((user, done) => {
    console.log("SERIALIZE USER", user)
    done(null, user);
});

// Deserialize user information from the session store
passport.deserializeUser((user, done) => {
    console.log("DESERIALIZE USER", user);
    done(null, user);
});

// Helper to obtain a display name from the given profile
function getName(profile) {
    if (profile.hasOwnProperty("name") && profile.name.hasOwnProperty("givenName")) {
        return profile.name.givenName;
    }
    if (profile.hasOwnProperty("displayName")) {
        return profile.displayName;
    }
    return "Unknown User";
}

// Middleware function to verify if user is authenticated
function isAuthenticated(req, res, next) {
    console.log("isAuthenticated", req);
    if (!req.isAuthenticated()) return res.status(401).send("No Access");
    next();
}


module.exports = { authRouter, isAuthenticated };