import Card from "./card.js";
import WhatToWatchAPI from "./what-to-watch-api.js";


const HOST = "http://localhost:4001/";

const api = new WhatToWatchAPI(HOST);
const recordList = document.getElementById("container-movies");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");


function setRecordList(records, cb) {
    recordList.replaceChildren();  // clears current children
    for (const record of records) {
        recordList.appendChild(Card.createCard(record, cb));
    }
}

function getMovies() {
    api.getMovies(records => setRecordList(records, deleteRecord));
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
    api.searchMovies(query, records => setRecordList(records, addMovie));
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

// document.getElementById("myselect").addEventListener("click", e => {
//     e.stopPropagation();
//     e.preventDefault();
// });