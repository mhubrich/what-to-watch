const express = require("express");
const { Record } = require("../utils/record");
const { Movie, MovieType } = require("../utils/movie");
const RecordList = require("../utils/recordlist");


const searchRouter = express.Router();

const toMovieType = type => {
    switch (type.toLowerCase()) {
        case "tvseries":
            return MovieType.Show;
        case "movie":
            return MovieType.Movie;
        default:
            return MovieType.Movie;
    }
}

searchRouter.get("/", async (req, res, next) => {
    if (!req.hasOwnProperty("query") || typeof req.query === "undefined" || !req.query.hasOwnProperty("q")) {
        return res.status(400).send("Query parameter is required.");
    }
    const query = req.query["q"];
    const url = `https://imdb-api.projects.thetuhin.com/search?query=${query}`;
    const data = await fetch(url);
    const results = await data.json();
    const recordList = new RecordList();
    for (const result of results.results) {
        let movie = new Movie(id=result.id,
                              name=result.title,
                              type=toMovieType(result.type),
                              poster=result.image);
        let record = new Record(movie);
        recordList.add(record);
    }
    res.status(200).json(recordList);
    next();
});

searchRouter.get("/:id", async (req, res, next) => {
    const imdb_id = req.params.id;
    const url = `https://imdb-api.projects.thetuhin.com/title/${imdb_id}`;
    const data = await fetch(url);
    const result = await data.json();
    if (!result.hasOwnProperty("id")) {
        return res.status(404).send("Title not found.");
    }
    const movie = new Movie(id=result.id,
                            name=result.title,
                            type=toMovieType(result.contentType),
                            poster=result.image,
                            rating=result.rating.star,
                            summary=result.plot);
    const record = new Record(movie);
    res.status(200).json(record); 
    next();
});


module.exports = searchRouter;