import Card from "./card.js";
import WhatToWatchAPI from "./what-to-watch-api.js";


/********** SETUP **********/
const HOST = "https://ywvnnjyi6j.execute-api.us-west-2.amazonaws.com/latest/";
const api = new WhatToWatchAPI(HOST);
let recordList = [];


/********** UI ELEMENTS **********/
const selectType = document.getElementById("select-type");
const selectUser = document.getElementById("select-user");
const selectSort = document.getElementById("select-sort");
const optgroupType = document.getElementById("optgroup-type");
const optgroupUser = document.getElementById("optgroup-user");
const backButton = document.getElementById("back-button");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const containerMovies = document.getElementById("container-movies");


/********** API INTERFACE **********/

function getMovies() {
    api.getMovies()
    .then(updateRecordList)
    .then(updateSelects)
    .then(filterRecordList)
    .then(sortRecordList)
    .then(callbackAdd)
    .then(displayRecords)
    .then(displaySearchView(false));
}

function searchMovies(query) {
    api.searchMovies(query)
    .then(updateRecordList)
    .then(callbackRemove)
    .then(displayRecords)
    .then(displaySearchView(true));
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

function addMovie(id) {
    searchMovie(id).then(postRecord);
}

function updateRecordList(records) {
    recordList = records;
}

function displayRecords(cb) {
    containerMovies.replaceChildren();  // clears current children
    recordList.forEach(record => containerMovies.appendChild(Card.createCard(record, cb)));
}

function callbackAdd() {
    return deleteRecord;
}

function callbackRemove() {
    return addMovie;
}

/********** SELECTS **********/

function displaySearchView(value) {
    if (value) {
        selectType.style.display = "none";
        selectUser.style.display = "none";
        selectSort.style.display = "none";
        backButton.style.display = "inline-block";
    } else {
        selectType.style.display = "inline-block";
        selectUser.style.display = "inline-block";
        selectSort.style.display = "inline-block";
        backButton.style.display = "none";
    }
}

function updateSelects() {
    populateSelect(selectType, optgroupType, "movie.type.name", Math.max(0, selectType.selectedIndex));
    populateSelect(selectUser, optgroupUser, "meta.userId", Math.max(0, selectUser.selectedIndex));
}

function populateSelect(select, optgroup, key, index) {
    // Clear current options
    select.replaceChildren();
    optgroup.replaceChildren();
    // Query new unique options based on `key`
    const options = [...new Set(recordList.map(record => getNestedProperty(record, key)))].sort();
    // Create new options and append to optgroup
    options.forEach(label => optgroup.appendChild(createOption(label, label)));
    // The first option is always a concatenation of all options
    if (options.length > 1) optgroup.prepend(createOption(options.join(", "), "all"));
    // Set new options group
    select.appendChild(optgroup);
    // Set index
    select.selectedIndex = index;
}

function getNestedProperty(obj, key) {
    const [head, ...rest] = key.split(".");
    if (rest.length > 0) {
        return getNestedProperty(obj[head], rest.join("."));
    } else {
        return obj[head];
    }
}

function createOption(label, value) {
    const option = document.createElement("option");
    option.innerHTML = label;
    option.setAttribute("value", value);
    return option;
}

/********** SORT **********/

function sortRecordList() {
    switch (selectSort.value) {
        case "0":
            updateRecordList(recordList.toSorted(sortAlphabetically));
            break;
        case "1":
            updateRecordList(recordList.toSorted(sortDate));
            break;
        case "2":
            updateRecordList(recordList.toSorted(sortRating));
        break;
    }
}

function sortAlphabetically(a, b) {
    if (a.movie.name < b.movie.name) {
        return -1;
    }
    if (a.movie.name > b.movie.name) {
        return 1;
    }
    return 0;
}

function sortDate(a, b) {
    return new Date(b.meta.dateAdded) - new Date(a.meta.dateAdded);
}

function sortRating(a, b) {
    return b.movie.rating - a.movie.rating;
}

/********** FILTERS **********/

function filterRecordList() {
    filterType();
    filterUser();
}

function filterType() {
    if (selectType.value != "all") {
        updateRecordList(recordList.filter(record => record.movie.type.name == selectType.value));
    }
}

function filterUser() {
    if (selectUser.value != "all") {
        updateRecordList(recordList.filter(record => record.meta.userId == selectUser.value));
    }
}

/********** LISTENERS **********/

// Retrieve movies when page is loaded or selects change
document.addEventListener("DOMContentLoaded", () => getMovies());
selectType.addEventListener("change", () => getMovies());
selectUser.addEventListener("change", () => getMovies());
selectSort.addEventListener("change", () => getMovies());

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

backButton.addEventListener("click", () => {
    searchBar.value = "";
    getMovies();
});