/**
 * Express Router that configures routes
 * 1) GET /     - uses query params `id` (IMDb id) and `type` (`movie` or `show`)
 *              to search for streaming provider information. Has two optional
 *              query parameters:
 *              a) `country` which accepts a two-letter country code
 *              b) `sorted` to return the results in order.
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
        case MovieType.Show.name:
            return "show";
        case MovieType.Movie.name:
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
    // Set country if provided, otherwise default to "ca"
    const country = req.query["country"] == undefined ? "ca" : req.query["country"];
    // Is true if query contains parameter `&sorted`, false otherwise
    const sorted = req.query["sorted"] == undefined ? false : true;
    const apiKey = config.get("streaming.justwatch.key");
    const url = `https://widget.justwatch.com/inline_widget?language=en&id_type=imdb&offer_label=price` + 
                `&api_key=${apiKey}&country=${country}&object_type=${type}&id=${id}`;
    // Use JSDOM to fetch the widget and query the HTML for all streaming offers
    JSDOM.fromURL(url)
    .then(dom => {
        const providers = [];
        // All divs with class `jw-offer` have the following children:
        // a) <a> - link to the streaming offer
        // b) <img> - image of the streaming provider
        // c) <div> - text label of the streaming offer
        for (const offer of dom.window.document.querySelectorAll(".jw-offer")) {
            // Get link
            let offerLink = offer.querySelector("a").href;
            let steamingLink = new URL(offerLink).searchParams.get("r");
            // Get image
            let offerImg = offer.querySelector("img");
            let streamingImg = offerImg.src;
            // Get label
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
        // if sorted was requested, sort the results so that "Free" < "Ads" < "Subs" < $
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