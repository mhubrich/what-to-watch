import {MovieCard, SearchCard} from "./card.js";
import WhatToWatchAPI from "./what-to-watch-api.js";


const HOST = "http://localhost:4001/";

const api = new WhatToWatchAPI(HOST);
const containerList = document.getElementById("container-main");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");


function setContainerList(records, createCard) {
    containerList.replaceChildren();  // clears current children
    for (const record of records) {
        containerList.appendChild(createCard(record));
    }
}

function getMovies() {
    api.getMovies(records => setContainerList(records, MovieCard.createCard));
}

function searchAll(query) {
    api.searchAll(query, records => setContainerList(records, SearchCard.createCard));
}

document.addEventListener("DOMContentLoaded", () => {
    // todo handle auth/login logic
    getMovies();
});

searchBar.addEventListener("search", () => {
    if (searchBar.value) {
        searchAll(searchBar.value);
    } else {
        getMovies();
    }
});

searchButton.addEventListener("click", () => {
    if (searchBar.value) {
        searchAll(searchBar.value);
    } else {
        getMovies();
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