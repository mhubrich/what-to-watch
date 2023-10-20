/*
* This module handles all UI interactions, including calling the API,
* creating cards dynamically, reacting to fitler and sort requests.
* While this module handles data retrieval, storage, and interaction,
* the `Card` module handles the UI appearance.
*/
import Card from "./card.js";
import WhatToWatchAPI from "./what-to-watch-api.js";


/********** CONFIG **********/
const HOST = "https://whattowatch.markushubrich.me/";
// const HOST = "http://localhost:4001/";


/********** GLOBAL VARIABLES **********/
const api = new WhatToWatchAPI(HOST);
let recordList = [];
const ICON_SPINNER = "fas fa-spinner fa-spin fa-fw";


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

/** 
* Retrieves all movies from the remote database, then filters, sorts,
* and displays the results.
*/
function getMovies() {
    return api.getMovies()
    .then(updateRecordList)
    .then(updateSelects)
    .then(filterRecordList)
    .then(sortRecordList)
    .then(displayRecords)
    .finally(() => displaySearchView(false));
}

/** 
* Makes an API call to search for a movie, then displays the result.
*/
function searchMovies(query) {
    return api.searchMovies(query)
    .then(updateRecordList)
    .then(displayRecords)
    .finally(() => displaySearchView(true));
}

/** 
* Stores a record in the remote database.
*/
function postRecord(record) {
    return api.postRecord(record);
}

/** 
* Retrieves IMDb movie attributes for a given ID.
*/
function searchMovie(id) {
    return api.searchMovie(id);
}

/** 
* Retrieves all streaming offers for a given IMDb ID and type (one of `movie`, `show`).
*/
function getStreamingProviders(id, type) {
    return api.streamingProviders(id, type, true);
}

/** 
* Adds a new record of a given `Card` and handles spinner actions.
*/
function addMovie(card) {
    Promise.resolve(card.setActionButtonSpinner())
    .then(() => searchMovie(card.movieId))
    .then(record => postRecord(record))
    .finally(() => card.setActionButtonIcon(Card.ACTION_DELETE));
}

/** 
* Deletes the record of a given `Card` and handles spinner and reload actions.
*/
function deleteRecord(card) {
    Promise.resolve(card.setActionButtonSpinner())
    .then(() => api.deleteRecord(card.metaId))
    .then(() => getMovies())
    .finally(() => card.setActionButtonIcon(Card.ACTION_ADD));
}

/** 
* Handles interaction with the streaming badge and streaming offers container.
*/
function streamingProviders(card) {
    if (card.isStreamingActive()) {
        card.closeStreaming();
    } else {
        // Fetch streaming offers only once and hold in memory
        Promise.resolve(card.setBadgeStreamingActive())
        .then(() => { card.setBadgeStreamingSpinner() })
        .then(() => { return card.isStreamingEmpty() })
        .then(isEmpty => { if (isEmpty) return getStreamingProviders(card.movieId, card.movieType) })
        .then(providers => { if (providers) card.createStreamingOffers(providers) })
        .finally(() => { 
            card.setBadgeStreamingIcon();
            card.openStreaming()
        });
    }
}

/** 
* Callback for all instances of `Card`.
* Using this callback, the following actions are fired:
* 1) Add:       add a new movie
* 2) Delete:    delete an existing movie
* 3) Streaming: retrieve streaming offers for a movie
*/
function cardCallback(action, card) {
    switch (action) {
        case Card.ACTION_ADD:
            addMovie(card)
            break;
        case Card.ACTION_DELETE:
            deleteRecord(card);
            break;
        case Card.ACTION_STREAMING:
            streamingProviders(card);
            break;
    }
}

/** 
* Sets a new `recordList`.
*/
function updateRecordList(records) {
    recordList = records;
}

/** 
* Clears the current view and creates new `Card` instances.
*/
function displayRecords() {
    containerMovies.replaceChildren();  // clears current children
    recordList.forEach(record => containerMovies.appendChild(new Card(record, cardCallback).card));
}

/********** SELECTS **********/

/** 
* If true, displays search view, otherwise displays movie list view.
*/
function displaySearchView(isSearchView) {
    if (isSearchView) {
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

/** 
* Updates both the Type and User selects.
* The Type select contains all movie types (`Movie` and `Show`).
* The User select consists of all users contained in `recordList`.
*/
function updateSelects() {
    populateSelect(selectType, optgroupType, "movie.type.name", Math.max(0, selectType.selectedIndex));
    populateSelect(selectUser, optgroupUser, "meta.userId", Math.max(0, selectUser.selectedIndex));
}

/** 
* Populates options for a given select's optgroup based on `recordList`.
*/
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

/** 
* Helper function.
*/
function getNestedProperty(obj, key) {
    const [head, ...rest] = key.split(".");
    if (rest.length > 0) {
        return getNestedProperty(obj[head], rest.join("."));
    } else {
        return obj[head];
    }
}

/** 
* Helper function.
*/
function createOption(label, value) {
    const option = document.createElement("option");
    option.innerHTML = label;
    option.setAttribute("value", value);
    return option;
}

/********** SORT **********/

/** 
* Sorts the `recordList` either
* 0) alphabetically,
* 1) by date,
* 2) by rating.
*/
function sortRecordList() {
    switch (selectSort.value) {
        case "0":
            updateRecordList(recordList.sort(sortAlphabetically));
            break;
        case "1":
            updateRecordList(recordList.sort(sortDate));
            break;
        case "2":
            updateRecordList(recordList.sort(sortRating));
        break;
    }
}

/** 
* Helper function.
*/
function sortAlphabetically(a, b) {
    if (a.movie.name < b.movie.name) {
        return -1;
    }
    if (a.movie.name > b.movie.name) {
        return 1;
    }
    return 0;
}

/** 
* Helper function.
*/
function sortDate(a, b) {
    return new Date(b.meta.dateAdded) - new Date(a.meta.dateAdded);
}

/** 
* Helper function.
*/
function sortRating(a, b) {
    return b.movie.rating - a.movie.rating;
}

/********** FILTERS **********/

/** 
* Filters `recordList` by Type and User selects.
*/
function filterRecordList() {
    filterType();
    filterUser();
}

/** 
* Helper function.
*/
function filterType() {
    if (selectType.value != "all") {
        updateRecordList(recordList.filter(record => record.movie.type.name == selectType.value));
    }
}

/** 
* Helper function.
*/
function filterUser() {
    if (selectUser.value != "all") {
        updateRecordList(recordList.filter(record => record.meta.userId == selectUser.value));
    }
}

/********** LISTENERS **********/

// Retrieve movies when page is loaded
document.addEventListener("DOMContentLoaded", () => getMovies());
// Select listeners
selectType.addEventListener("change", () => getMovies());
selectUser.addEventListener("change", () => getMovies());
selectSort.addEventListener("change", () => getMovies());
// Back button listener
backButton.addEventListener("click", () => back());
// Search bar listeners
searchButton.addEventListener("click", () => search());
searchBar.addEventListener("search", () => search());
searchBar.addEventListener("focus", () => searchBar.value = "");

/** 
* Starts a search if the search bar is non-empty, otherwise displays current `recordList`.
*/
function search() {
    searchBar.blur(); // removing focus forces mobile keyboard to close
    if (searchBar.value) {
        showContent(() => searchMovies(searchBar.value));
    } else {
        showContent(() => getMovies());
    }
}

/** 
* Controls the spinner of the search button.
*/
function showContent(promise) {
    const icon = searchButton.querySelector("i");
    const cls = icon.className;
    setSpinner(icon)
    .then(promise)
    .finally(() => resetSpinner(icon, cls));
}

/** 
* Back button with spinner animation.
*/
function back() {
    const icon = backButton.querySelector("i");
    const cls = icon.className;
    setSpinner(icon)
    .then(getMovies)
    .finally(() => {
        resetSpinner(icon, cls);
        searchBar.value = "";
    });
}

/********** SPINNERS **********/

/** 
* Returns a resolved promise that replaces a given icon with a spinner.
*/
function setSpinner(icon) {
    return Promise.resolve(setClass(icon, ICON_SPINNER));
}

/** 
* Returns a resolved promise that replaces a spinner with a given icon.
*/
function resetSpinner(icon, cls) {
    return new Promise(resolve => resolve(setClass(icon, cls)));
}

/** 
* Sets the class of an element.
*/
function setClass(elem, cls) {
    elem.className = cls;
}