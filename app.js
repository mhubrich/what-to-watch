const express = require("express");
const session = require('express-session');
const passport = require("passport");
const config = require('config');
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
const DynamoDatabase = require("./db/dynamodatabase");
const mainRouter = require("./routers/mainrouter");
const searchRouter = require("./routers/searchrouter");
const { authRouter, isAuthenticated } = require("./routers/authrouter");


const app = express();

app.use(cors());

app.use(bodyParser.json())

app.use(session({
    secret: config.get("session.secret"),
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },  // 24 hours
}));

app.use(passport.initialize());
app.use(passport.session());

// Sends back site verification code to enable domain authorization (Google OAuth2)
app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "config/googleSiteVerification.html"));
});

app.use("/", authRouter);
app.use("/movies", isAuthenticated);
app.use("/search", isAuthenticated);

app.use("/movies", (req, res, next) => {
    const table = config.get("database.table");
    const region = config.get("database.region");
    req.db = new DynamoDatabase(table, region);
    next();
});

app.use("/movies", mainRouter);

app.use("/search", searchRouter);

module.exports = app;
// app.listen(4001);