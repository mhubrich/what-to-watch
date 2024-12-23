/**
 * Express Router that configures routes
 * 1) GET /     - use query param `q` to search for movies
 * 2) GET /:id  - get information about a movie with matching `id`
 * This router is using a third-party IMDb API to retrieve movie information.
 */
const express = require("express");
const parse5 = require("parse5");
const { Record } = require("../utils/record");
const { Movie, MovieType } = require("../utils/movie");
const { findChild } = require("../utils/tree-query");


// Creates an Express Router which is later exported as a module
const searchRouter = express.Router();

// Converts IMDB movie types to types defined in `MovieType`
const toMovieType = type => {
    switch (type.toLowerCase()) {
        case "tvseries":
        case "tvminiseries":
        case "tvepisode":
            return MovieType.Show;
        case "movie":
        case "feature":
        case "tvmovie":
        case "tvspecial":
        case "tvshort":
        case "short":
        case "documentary":
        case "video":
            return MovieType.Movie;
        default:
            return MovieType.Movie;
    }
}

// Uses the IMDB API to search for movies based on the query parameter `q`
searchRouter.get("/", (req, res, next) => {
    if (!req.hasOwnProperty("query") || typeof req.query === "undefined" || !req.query.hasOwnProperty("q")) {
        return res.status(400).send("Query parameter is required.");
    }
    
    Promise.resolve(req.query["q"])
    .then(query => {
        const url = `https://v3.sg.media-imdb.com/suggestion/x/${query}.json?includeVideos=0`;
        return fetch(url);
    })
    .then(async data => {
        const results = await data.json();
        const recordList = [];
        // Create a new `Record` for every search result
        for (const result of results.d) {
            try {
                let movie = new Movie(id=result.id,
                                    name=result.l ?? "",
                                    type=toMovieType(result.qid ?? ""),
                                    poster=result.i?.imageUrl,
                                    year=result.y ?? 0,
                                    imdb=`https://www.imdb.com/title/${result.id}`);
                let record = new Record(movie);
                recordList.push(record);
            } catch (error) {
                // Skip item in case of an error
                console.log(error);
            }
        }
        res.status(200).json(recordList);
        next();
    })
    .catch (error => {
        console.log(error);
        return res.status(500).send("Unable to search for titles.");
    });
});

// Uses the IMDB API to retrieve information about a specific movie with matching `id`
searchRouter.get("/:id", async (req, res, next) => {
    if (!req.params.id || req.params.id.length == 0) {
        return res.status(400).send("Movie ID is required.");
    }

    const imdb_id = req.params.id;
    const url = `https://www.imdb.com/title/${imdb_id}`;

    // Extract all required data from resource at `url`
    Promise.resolve(url)
    .then(url => fetch(url))
    .then(async response => {
        // Get HTML content from response
        const imdbHTML = await response.text();
        const document = parse5.parse(imdbHTML);
        const html = findChild(document, "html");
        const head = findChild(html, "head");
        const body = findChild(html, "body");

        // Check if title was found
        if (findChild(body, "div", "id", "error")) {    
            return res.status(404).send("Title not found.");
        }

        // Parse all required elements
        const scheme = findChild(head, "script", "type", "application/ld+json");
        const mainScheme = JSON.parse(scheme.childNodes[0].value);
        const data = findChild(body, "script", "id", "__NEXT_DATA__");
        const dataParsed = JSON.parse(data.childNodes[0].value);
        const mainData = dataParsed.props.pageProps.mainColumnData;

        // Workaround to avoid missing images (mostly pre-release movies)
        let image = mainScheme.image;
        if (!image) {
            const images = mainData.titleMainImages.edges.filter(e => e.__typename === "ImageEdge").map(e => e.node.url);
            if (images && images.length > 0) {
                image = images[0];
            }
        }

        // Create a new `Record` with the obtained information
        const movie = new Movie(id=imdb_id,
                                name=mainScheme.name ?? "",
                                type=toMovieType(mainScheme["@type"] ?? ""),
                                poster=image,
                                year=mainData.releaseDate?.year ?? 0,
                                imdb=url,
                                rating=mainScheme.aggregateRating?.ratingValue ?? 0,
                                summary=mainScheme.description ?? "",
                                runtime=parseSecondToTime(mainData.runtime?.seconds ?? 0),
                                genre=mainScheme.genre ?? []);
        const record = new Record(movie);

        // Respond with new `Record`
        res.status(200).json(record); 
        next();
    })
    .catch (error => {
        console.log(error);
        return res.status(500).send("Unable to retrieve title.");
    }); 
});

// Helper function to create readable timestamps
function parseSecondToTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - hours * 3600) / 60);
    let second = seconds - hours * 3600 - minutes * 60;
  
    let result = "";
    if (hours > 0) result += hours + "h ";
  
    if (minutes > 0) result += minutes + "m ";
    if (second > 0) result += second + "s";
  
    return result.trim();
}


module.exports = searchRouter;