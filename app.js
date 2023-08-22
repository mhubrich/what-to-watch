const express = require("express");
const session = require('express-session');
const passport = require("passport");
const config = require('config');
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
const DynamoDBStore = require("dynamodb-store");
const mainRouter = require("./routers/mainrouter");
const searchRouter = require("./routers/searchrouter");
const { authRouter, isAuthenticated } = require("./routers/authrouter");

// Create an instance of the Express application
const app = express();

// Enable CORS
app.use(cors());

// Parse incoming request bodies and male them available under the req.body property
app.use(bodyParser.json())

app.use(session({
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
        ttl: 86400000 // 1 day
    }),
}));

app.use(passport.initialize());
app.use(passport.session());

// Send back a site verification code to enable domain authorization (Google OAuth2)
app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "config/googleSiteVerification.html"));
});

// Set up all routes
app.use("/", authRouter);
app.use("/movies", isAuthenticated, mainRouter);
app.use("/search", isAuthenticated, searchRouter);

module.exports = app;