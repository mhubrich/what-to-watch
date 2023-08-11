const express = require("express");
const RecordList = require("../utils/recordlist");


const mainRouter = express.Router();

mainRouter.get("/", (req, res, next) => {
    if (!req.hasOwnProperty('db') || typeof req.db === "undefined") {
        return res.status(500).send("Could not find database.");
    }
    const recordList = req.db.getAll();
    if (typeof recordList === "undefined" || !(recordList instanceof RecordList)) {
        return res.status(500).send("Could not retrieve records from database.");
    }
    res.status(200).json(RecordList.toJSON(recordList));
    next();
});

mainRouter.post("/", (req, res, next) => {
    next();
});

mainRouter.delete("/:id", (req, res, next) => {
    next();
});

module.exports = mainRouter;