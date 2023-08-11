const express = require("express");
const RecordList = require("../utils/recordlist");


const mainRouter = express.Router();

mainRouter.get("/", (req, res, next) => {
    next();
});

mainRouter.post("/", (req, res, next) => {
    next();
});

mainRouter.delete("/:id", (req, res, next) => {
    next();
});

module.exports = mainRouter;