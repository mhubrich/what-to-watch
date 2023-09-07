import Card from "./card.js";
import WhatToWatchAPI from "./what-to-watch-api.js";


const HOST = "http://localhost:4001/";

let recordList = [];
const api = new WhatToWatchAPI(HOST);
const containerMovies = document.getElementById("container-movies");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const selectType = document.getElementById("select-type");
const selectUser = document.getElementById("select-user");
const selectSort = document.getElementById("select-sort");
const optgroupType = document.getElementById("optgroup-type");
const optgroupUser = document.getElementById("optgroup-user");


function displayRecords(cb) {
    containerMovies.replaceChildren();  // clears current children
    for (const record of recordList) {
        containerMovies.appendChild(Card.createCard(record, cb));
    }
}

function updateSelectors() {
    populateSelect(selectType, optgroupType, "movie.type.name");
    populateSelect(selectUser, optgroupUser, "meta.userId");
}

function updateRecordList(records) {
    recordList = records;
}

function callbackAdd() {
    return deleteRecord;
}

function callbackRemove() {
    return addMovie;
}

function getMovies() {
    api.getMovies()
    .then(updateRecordList)
    .then(updateSelectors)
    .then(callbackAdd)
    .then(displayRecords);
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
    api.searchMovies(query)
    .then(updateRecordList)
    // .then(updateSelectors)  TODO
    .then(callbackRemove)
    .then(displayRecords);
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

function getNestedProperty(obj, key) {
    const [head, ...rest] = key.split(".");
    if (rest.length > 0) {
        return getNestedProperty(obj[head], rest.join("."));
    } else {
        return obj[head];
    }
}

function createOption(label) {
    const option = document.createElement("option");
    option.innerHTML = label;
    option.setAttribute("value", label);
    return option;
}

function populateSelect(select, optgroup, key) {
    // Clear current options
    select.replaceChildren();
    optgroup.replaceChildren();
    // Query new unique options based on `key`
    const options = [...new Set(recordList.map(record => getNestedProperty(record, key)))].sort();
    // Create new options and append to optgroup
    options.forEach(label => optgroup.appendChild(createOption(label)));
    // The first option is always a concatenation of all options
    if (options.length > 1) optgroup.prepend(createOption(options.join(", ")));
    // Set new options group
    select.appendChild(optgroup);
}