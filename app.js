const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mainRouter = require("./routers/mainrouter");
const searchRouter = require("./routers/searchrouter");
const FileDatabase = require("./db/filedatabase");


const app = express();

app.use(cors());

app.use(bodyParser.json())

app.use("/", (req, res, next) => {
    req.db = new FileDatabase("tmp.json");
    next();
});

app.use("/movies", mainRouter);

app.use("/search", searchRouter);


const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));