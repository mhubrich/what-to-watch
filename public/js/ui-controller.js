import {MovieCard, SearchCard} from "./card.js";
import WhatToWatchAPI from "./what-to-watch-api.js";


const HOST = "http://localhost:4001/";

const api = new WhatToWatchAPI(HOST);
const recordList = document.getElementById("container-main");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");


function setRecordList(createCard, records, cb) {
    recordList.replaceChildren();  // clears current children
    for (const record of records) {
        recordList.appendChild(createCard(record, cb));
    }
}

function getMovies() {
    api.getMovies(records => setRecordList(MovieCard.createCard,records, undefined));
}

function searchMovies(query) {
    api.searchMovies(query, records => setRecordList(SearchCard.createCard, records, addMovie));
}

function searchMovie(id) {
    return api.searchMovie(id);
}

function postRecord(record) {
    api.postRecord(record);
}

function addMovie(id) {
    searchMovie(id).then(postRecord);
}

document.addEventListener("DOMContentLoaded", () => {
    // todo handle auth/login logic
    getMovies();
});

searchBar.addEventListener("search", () => {
    if (searchBar.value) {
        searchMovies(searchBar.value);
    } else {
        getMovies();
    }
});

searchButton.addEventListener("click", () => {
    if (searchBar.value) {
        searchMovies(searchBar.value);
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