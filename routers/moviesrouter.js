const express = require("express");
const crypto = require("crypto");
const config = require("config");
const DynamoDatabase = require("../db/dynamodatabase");
const { Record, RecordMeta } = require("../utils/record");


// Creates an Express Router which is later exported as a module
const mainRouter = express.Router();

/**
 * Creates a new instance of `RecordMeta` based on the given user details.
 * @param {Object} user     Object with `name` property.
 * @return {`RecordMeta`}   New instance of `RecordMeta`.
 */
function createRecordMeta(user) {
    const id = crypto.randomUUID();         // Random UUID
    const userId = user.name;               // Display name of the user
    const dateAdded = new Date().toJSON();  // Current date
    return new RecordMeta(id, userId, dateAdded);
}

// Attaches an instance of `DynamoDatabase` to every request.
mainRouter.use("/", (req, res, next) => {
    const table = config.get("database.movies.table");
    const region = config.get("database.movies.region");
    req.db = new DynamoDatabase(table, region);
    next();
});

/**
 * Retrieves all movie records from the data store.
 * If successful, responds with JSON object and status code 200.
 * If unsuccessful, responds with status code 500.
 */
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

/**
 * Adds a new record to the data store.
 * The record to be stored has to be contained in the request's body.
 * If unsuccessful, responds with status code 500.
 */
mainRouter.post("/", (req, res, next) => {
    if (!req.hasOwnProperty('db') || typeof req.db === "undefined") {
        return res.status(500).send("Could not find database.");
    }
    const record = req.body;
    if (!Record.isValid(record)) {
        return res.status(500).send("Could not parse body");
    }
    record.meta = createRecordMeta(req.user);
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

/**
 * Deletes a record from the data store.
 * The identifier of the record is the last part of the route's path. 
 * If unsuccessful, responds with status code 500.
 */
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