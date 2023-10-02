/**
 * Express Router that configures routes
 * 1) GET /     - uses query params `id` (IMDb id) and `type` (`movie` or `show`)
 *              to search for streaming provider information. Has an optional
 *              query parameter `sorted` to return the results in order.
 * This router is using a third-party JustWatch API to retrieve movie information.
 */
const express = require("express");
const config = require("config");
const { JSDOM } = require("jsdom");
const { MovieType } = require("../utils/movie");


// Creates an Express Router which is later exported as a module
const streamingRouter = express.Router();

// Converts `MovieType` to JustWatch's object type
const toObjectType = type => {
    switch (type) {
        case MovieType.Show:
            return "show";
        case MovieType.Movie:
            return "movie";
        default:
            return "movie";
    }
}

// Uses the JustWatch API to retrieve streaming information about a specific title with
// query parameters `id` (IMDb id) and `type` (`movie` or `show`)
streamingRouter.get("/", async (req, res, next) => {
    if (!req.hasOwnProperty("query") || typeof req.query === "undefined") {
        return res.status(400).send("Query parameter is required.");
    }
    if (!req.query.hasOwnProperty("id") || !req.query.hasOwnProperty("type")) {
        return res.status(400).send("Incorrect query parameters.");
    }
    const id = req.query["id"];
    const type = toObjectType(req.query["type"]);
    const sorted = req.query["sorted"] == undefined ? false : true;
    const apiKey = config.get("streaming.justwatch.key");
    const url = `https://widget.justwatch.com/inline_widget?language=en&id_type=imdb&offer_label=price` + 
                `&api_key=${apiKey}&object_type=${type}&id=${id}`;
    JSDOM.fromURL(url)
    .then(dom => {
        const providers = [];
        for (const offer of dom.window.document.querySelectorAll(".jw-offer")) {
            let offerLink = offer.querySelector("a").href;
            let steamingLink = new URL(offerLink).searchParams.get("r");
            let offerImg = offer.querySelector("img");
            let streamingImg = offerImg.src;
            let offerLabel = offer.querySelector("div").textContent;
            let streamingLabel = offerLabel.replace(/^\s+|\s+$/g, "");  // removes all whitespaces
            providers.push({
                link: steamingLink,
                img: streamingImg,
                label: streamingLabel
            });
        }
        dom.window.close();
        return providers;
    })
    .then(providers => {
        if (sorted) {
            providers.sort((a, b) => {
                labels = ["Free", "Ads", "Subs"];
                const indexA = labels.indexOf(a.label);
                const indexB = labels.indexOf(b.label);
                if (indexA == -1 && indexB == -1) {  // both labels are prices
                    return Number(a.label.substring(1)) - Number(b.label.substring(1));
                }
                return indexB - indexA;
            })
        }
        res.status(200).json(providers);
    })
    .catch(error => {
        console.log(error);
        return res.status(404).send(error.message);
    });
});


module.exports = streamingRouter;