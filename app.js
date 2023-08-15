const express = require("express");
const config = require('config');
const cors = require("cors");
const bodyParser = require("body-parser");
const mainRouter = require("./routers/mainrouter");
const searchRouter = require("./routers/searchrouter");
const DynamoDatabase = require("./db/dynamodatabase");


const app = express();

app.use(cors());

app.use(bodyParser.json())

app.use("/movies", (req, res, next) => {
    const table = config.get("database.table");
    const region = config.get("database.region");
    req.db = new DynamoDatabase(table, region);
    next();
});

app.use("/movies", mainRouter);

app.use("/search", searchRouter);


module.exports = app;