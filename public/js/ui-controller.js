import {MovieCard, SearchCard} from "./card.js";
import WhatToWatchAPI from "./what-to-watch-api.js";


const HOST = "http://localhost:4001/";

const movieList = new WhatToWatchAPI(HOST);
const containerList = document.getElementById("container-main");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");


function setMovieList(list) {
    const cards = []
    for (const record of list) {
        cards.push(MovieCard.createCard(record));
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