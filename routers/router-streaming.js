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
const parse5 = require("parse5");
const { MovieType } = require("../utils/movie");
const { findChild, filterChildren } = require("../utils/tree-query");


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
streamingRouter.get("/", (req, res, next) => {
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

    // Extract all required data from resource at `url`
    Promise.resolve(url)
    .then(url => fetch(url))
    .then(async response => {
        // Get HTML content from response
        const jwHTML = await response.text();
        const document = parse5.parse(jwHTML);
        const html = findChild(document, "html");
        const body = findChild(html, "body");

        let offers = []
        // Check if movie was found
        if (!findChild(body, "div", "id", "message")) {    
            const widget = findChild(body, "div", "id", "jw-widget");
            offers = filterChildren(widget, "div", "class", "jw-offer");
        }

        const providers = [];
        // All divs with class `jw-offer` have the following children:
        // a) <a> - link to the streaming offer
        // b) <img> - image of the streaming provider
        // c) <div> - text label of the streaming offer
        for (const offer of offers) {
            // Get link
            let a = findChild(offer, "a");
            let offerLink = a.attrs.find(e => e.name === "href").value;
            let steamingLink = new URL(offerLink).searchParams.get("r");
            // Get image
            let offerImg = findChild(a, "img");
            let streamingImg = offerImg.attrs.find(e => e.name === "src").value;
            // Get label
            let offerLabel = findChild(a, "div");
            let streamingLabel = offerLabel.childNodes[0].value.replace(/^\s+|\s+$/g, "");  // removes all whitespaces

            providers.push({
                link: steamingLink,
                img: streamingImg,
                label: streamingLabel
            });
        }
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
        return providers;
    })
    .then(providers => {
        res.status(200).json(providers);
        next();
    })
    .catch (error => {
        console.log(error);
        return res.status(404).send(error.message);
    }); 
});


module.exports = streamingRouter;