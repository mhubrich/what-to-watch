const express = require("express");
const crypto = require("crypto");
const config = require("config");
const DynamoDatabase = require("../db/dynamodatabase");
const { Record, RecordMeta } = require("../utils/record");


const mainRouter = express.Router();

function addRecordMeta(record) {
    const id = crypto.randomUUID();
    const userId = "user"; // TODO
    const dateAdded = new Date().toJSON();
    record.meta = new RecordMeta(id, userId, dateAdded);
}

mainRouter.use("/", (req, res, next) => {
    const table = config.get("database.movies.table");
    const region = config.get("database.movies.region");
    req.db = new DynamoDatabase(table, region);
    next();
});

mainRouter.get("/", (req, res, next) => {
    if (!req.hasOwnProperty('db') || typeof req.db === "undefined") {
        return res.status(500).send("Could not find database.");
    }
    req.db.getAll()
        .then(recordList => {
            res.status(200).json(recordList);
            next();
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send("Could not retrieve records from database.");
        });
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
    req.db.add(record)
        .then(() => {
            res.status(201).send();
            next();
        })
        .catch (error => {
            console.log(error);
            return res.status(500).send("Could not add record to database.");
        });
});

mainRouter.delete("/:id", (req, res, next) => {
    if (!req.hasOwnProperty('db') || typeof req.db === "undefined") {
        return res.status(500).send("Could not find database.");
    }
    req.db.remove(req.params.id)
        .then(() => {
            res.status(200).send();
            next();
        })
        .catch (error => {
            console.log(error);
            return res.status(500).send("Could not delete record from database.");
        });
});


module.exports = mainRouter;