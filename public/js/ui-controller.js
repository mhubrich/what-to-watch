import WhatToWatchAPI from "./what-to-watch-api.js";


const HOST = "http://localhost:4001/";

const movieList = new WhatToWatchAPI(HOST);
const containerList = document.getElementById("container-main");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");

function createElement(tagName, className, children) {
    const elem = document.createElement(tagName);
    elem.className = className;

    if (children) {
        if (children instanceof Element) {
            children = [children];
        }
        for (const child of children) {
            elem.appendChild(child);
        }
    }

    return elem;
}

function createCard(name, summary, posterSrc, posterAlt) {
    const cardTitle = createElement("h5", "card-title");
    cardTitle.innerHTML = name;
    const cardText = createElement("p", "card-text");
    cardText.innerHTML = summary;
    const cardBody = createElement("div", "card-body", [cardTitle, cardText]);
    const colContent = createElement("div", "col-md-8", cardBody);
    const img = createElement("img", "img-fluid rounded-start");
    img.src = posterSrc;
    img.alt = posterAlt;
    const colImg = createElement("div", "col-md-4", img);
    const row = createElement("div", "row g-0", [colImg, colContent]);
    const card = createElement("div", "card mb-3", row);
    const col = createElement("div", "col", card);
    return col;
}

function setMovieList(list) {
    const cards = []
    for (const record of list) {
        cards.push(createCard(record.movie.name, record.movie.summary,
                              record.movie.poster, record.movie.name))
    }
    setContainerList(cards)
}

function setContainerList(cards) {
    containerList.replaceChildren();  // clears current children
    for (const card of cards) {
        containerList.appendChild(card);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // todo handle auth/login logic
    movieList.getMovies(setMovieList);
});

searchBar.addEventListener("search", () => {
    if (!searchBar.value) {
        movieList.getMovies(setMovieList);
    }
});

searchButton.addEventListener("click", () => {
    if (searchBar.value) {
        // todo
    }
});

// btnLogin.addEventListener("click", () => {
//   window.location.href = new URL("login", HOST).href;
// });

// btnLogout.addEventListener("click", () => {
//   fetch(new URL("logout", HOST), {
//     method: "GET",
//     credentials: "include"
//   });
// });