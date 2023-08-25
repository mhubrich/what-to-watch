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
    api.getMovies(records => setRecordList(MovieCard.createCard,records, deleteRecord));
}

function searchMovies(query) {
    api.searchMovies(query, records => setRecordList(SearchCard.createCard, records, addMovie));
}

function addMovie(id) {
    api.searchMovie(id).then(api.postRecord);
}

function deleteRecord(id) {
    api.deleteRecord(id).then(getMovies);
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