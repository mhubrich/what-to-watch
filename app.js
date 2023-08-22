const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { authRouter, isAuthenticated } = require("./routers/authrouter");
const loginRouter = require("./routers/loginrouter");
const mainRouter = require("./routers/mainrouter");
const searchRouter = require("./routers/searchrouter");


// Create an instance of the Express application
const app = express();

// Enable CORS
app.use(cors());

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