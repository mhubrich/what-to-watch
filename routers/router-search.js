/**
 * Express Router that configures routes
 * 1) GET /     - use query param `q` to search for movies
 * 2) GET /:id  - get information about a movie with matching `id`
 * This router is using a third-party IMDB API to retrieve movie information.
 */
const express = require("express");
const { Record } = require("../utils/record");
const { Movie, MovieType } = require("../utils/movie");


// Creates an Express Router which is later exported as a module
const searchRouter = express.Router();

// Uses the IMDB API by TheTuhin
const HOST = "https://imdb-api.projects.thetuhin.com/";

// Converts IMDB movie types to types defined in `MovieType`
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

// Uses the IMDB API to search for movies based on the query parameter `q`
searchRouter.get("/", async (req, res, next) => {
    if (!req.hasOwnProperty("query") || typeof req.query === "undefined" || !req.query.hasOwnProperty("q")) {
        return res.status(400).send("Query parameter is required.");
    }
    const query = req.query["q"];
    const url = HOST + `search?query=${query}`;
    const data = await fetch(url);
    const results = await data.json();
    const recordList = [];
    // Create a new `Record` for every search result
    for (const result of results.results) {
        let movie = new Movie(id=result.id,
                              name=result.title,
                              type=toMovieType(result.type),
                              poster=result.image);
        let record = new Record(movie);
        recordList.push(record);
    }
    res.status(200).json(recordList);
    next();
});

// Uses the IMDB API to retrieve information about a specific movie with matching `id`
searchRouter.get("/:id", async (req, res, next) => {
    const imdb_id = req.params.id;
    const url = HOST + `title/${imdb_id}`;
    const data = await fetch(url);
    const result = await data.json();
    if (!result.hasOwnProperty("id")) {
        return res.status(404).send("Title not found.");
    }
    // Create a new `Record` with the obtained information
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