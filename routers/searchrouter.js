const express = require("express");


const searchRouter = express.Router();

searchRouter.get("/", (req, res, next) => {
    next();
});


module.exports = searchRouter;