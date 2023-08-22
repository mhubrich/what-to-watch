const express = require("express");
const cors = require("cors");
const config = require("config");
const audit = require('express-requests-logger');
const bodyParser = require("body-parser");
const { authRouter, isAuthenticated } = require("./routers/authrouter");
const loginRouter = require("./routers/loginrouter");
const mainRouter = require("./routers/moviesrouter");
const searchRouter = require("./routers/searchrouter");


// Create an instance of the Express application
const app = express();

// Enable logging of every request (exluding two large headers)
app.use(audit({
    request: {
        excludeHeaders: ["x-apigateway-event", "x-apigateway-context"]
    }
}));

// Enable CORS and whitelist origin
app.use(cors({ credentials: true, origin: config.get("cors.origin") }));

// Make incoming request bodies available under the req.body property
app.use(bodyParser.json())

// Set up user authentication
app.use(authRouter);

// Set up all routes
app.use("/", loginRouter);
app.use("/movies", isAuthenticated, mainRouter);
app.use("/search", isAuthenticated, searchRouter);


// Expose express application
module.exports = app;