/**
 * Express.js Application to serve the API.
 *
 * This file defines all main functions to bootstrap the API. It creates an Express application,
 * sets up middleware, and creates all routes.
 */
const express = require("express");
const cors = require("cors");
const config = require("config");
const audit = require('express-requests-logger');
const bodyParser = require("body-parser");
const { authRouter, isAuthenticated } = require("./routers/router-auth");
const mainRouter = require("./routers/router-movies");
const searchRouter = require("./routers/router-search");
const streamingRouter = require("./routers/router-streaming");


// Create an instance of the Express application
const app = express();

// Enable logging of every request (exluding two large headers)
app.use(audit({ request: { excludeHeaders: ["x-apigateway-event", "x-apigateway-context"] } }));

// Enable CORS and whitelist origin
app.use(cors({ credentials: true, origin: config.get("app.domain") }));

// Make incoming request bodies available under the req.body property
app.use(bodyParser.json())

// Set up user authentication
app.set("trust proxy", 1); // Required to accept cross-site cookies, see Express Readme
app.use(authRouter);

// Set up all routes
app.use("/movies", isAuthenticated, mainRouter);
app.use("/search", isAuthenticated, searchRouter);
app.use("/streaming", isAuthenticated, streamingRouter);

// Expose express application
module.exports = app;
// app.use(express.static('public'));
// app.listen(4001);