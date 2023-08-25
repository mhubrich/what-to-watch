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

function postRecord(record) {
    api.postRecord(record);
}

function deleteRecord(id) {
    api.deleteRecord(id).then(getMovies);
}

function searchMovie(id) {
    return api.searchMovie(id);
}

function searchMovies(query) {
    api.searchMovies(query, records => setRecordList(SearchCard.createCard, records, addMovie));
}

function addMovie(id) {
    searchMovie(id).then(postRecord);
}

document.addEventListener("DOMContentLoaded", () => {
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
