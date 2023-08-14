const express = require("express");
const { Record, RecordMeta } = require("../utils/record");
const RecordList = require("../utils/recordlist");


const mainRouter = express.Router();

function addRecordMeta(record) {
    const id = crypto.randomUUID();
    const userId = 0; // TODO
    const dateAdded = new Date();
    record.meta = new RecordMeta(id, userId, dateAdded);
}

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
    addRecordMeta(record);
    if (!req.db.add(record)) {
        return res.status(500).send("Could not add record to database.");
    }
    res.status(201).send();
    next();
});

mainRouter.delete("/:id", (req, res, next) => {
    if (!req.hasOwnProperty('db') || typeof req.db === "undefined") {
        return res.status(500).send("Could not find database.");
    }
    if (!req.db.remove(req.params.id)) {
        return res.status(500).send("Could not delete record from database.");
    }
    res.status(200).send();
    next();
});


module.exports = mainRouter;