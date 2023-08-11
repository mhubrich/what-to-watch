const express = require("express");
const { Record } = require("../utils/record");
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
    res.status(200).json(recordList);
    next();
});

mainRouter.post("/", (req, res, next) => {
    if (!req.hasOwnProperty('db') || typeof req.db === "undefined") {
        return res.status(500).send("Could not find database.");
    }
    const record = req.body;
    if (!Record.isValid(record)) {
        return res.status(500).send("Could not parse body");
    }
    const recordList = req.db.add(record);
    if (typeof recordList === "undefined" || !(recordList instanceof RecordList)) {
        return res.status(500).send("Could not retrieve records from database.");
    }
    res.status(201).json(recordList);
    next();
});

mainRouter.delete("/:id", (req, res, next) => {
    next();
});

module.exports = mainRouter;