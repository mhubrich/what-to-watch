/**
* Implementation of the What-To-Watch-API interface.
* This class retrieves items from a cache if the data store has not been changed.
* @class WhatToWatchAPI
*/
export default class WhatToWatchAPI {

    constructor(host) {
        this.host = host;  // `host` is the URL of the API
        this.cache = [];   // simple in-memory cache
        this.stale = true; // true, if `cache` has become stale
    }

    /** 
    * Retrieves all movies from the remote data store.
    * Uses a cache to hold items while data store is unchanged.
    * @async
    * @return {JSON} List of movies in JSON.
    */
    async getMovies() {
        return new Promise(resolve => {
            // Only update movies if `cache` has become stale
            if (this.stale) {
                this.cache = fetch(new URL("movies", this.host), {
                    method: "GET",
                    credentials: "include"
                })
                .then(this.checkStatusCode)
                .then(response => response.json())
                .then(this.stale = false);
            }
            resolve(this.cache);
        })
        .catch(error => this.catchError(error));
    }

    /** 
    * Posts a new record to the remote data store.
    * @async
    * @param {Object} record    Record to be stored.
    * @return {String}          ID of the stored item.
    */
    async postRecord(record) {
        // Post record and invalidate cache
        return fetch(new URL("movies", this.host), {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(record),
            headers: { "Content-Type": "application/json" }
        })
        .then(this.checkStatusCode)
        .then(this.stale = true)
        .then(response => response.json())
        .then(response => response.id)
        .catch(error => this.catchError(error));
    }

    /** 
    * Deletes a record from the remote data store.
    * @async
    * @param {String} id    ID of the record to be deleted.
    */
    async deleteRecord(id) {
        // Delete record and invalidate cache
        await fetch(new URL("movies/" + id, this.host), {
            method: "DELETE",
            credentials: "include"
        })
        .then(this.checkStatusCode)
        .then(this.stale = true)
        .catch(error => this.catchError(error));
    }

    /** 
    * Searches movies for a given query.
    * @async
    * @param {String} query Movie to search for.
    * @return {JSON}        Movie list in JSON.
    */
    async searchMovies(query) {
        const url = new URL("search", this.host);
        url.searchParams.append("q", query);
        return fetch(url, {
            method: "GET",
            credentials: "include"
        })
        .then(this.checkStatusCode)
        .then(response => response.json())
        .catch(error => this.catchError(error));
    }

    /** 
    * Retrieves IMDb movie attributes for a given movie ID.
    * @async
    * @param {String} id    IMDb ID of the moivie.
    * @return {JSON}        Movie in JSON format.
    */
    async searchMovie(id) {
        return fetch(new URL("search/" + id, this.host), {
            method: "GET",
            credentials: "include"
        })
        .then(this.checkStatusCode)
        .then(response => response.json())
        .catch(error => this.catchError(error));
    }

    /** 
    * Retrieves streaming offer information.
    * @async
    * @param {String} id        IMDb ID of the movie.
    * @param {String} type      One of `movie` or `show`.
    * @param {String} sorted    If set, the response is ordered.
    * @return {JSON}            List of streaming offers in JSON.
    */
    async streamingProviders(id, type, sorted) {
        const url = new URL("streaming", this.host);
        url.searchParams.append("id", id);
        url.searchParams.append("type", type);
        url.searchParams.append("sorted", sorted);
        return fetch(url, {
            method: "GET",
            credentials: "include"
        })
        .then(this.checkStatusCode)
        .then(response => response.json())
        .catch(error => this.catchError(error));
    }

    /** 
    * Redirects the browser to the login page.
    */
    login() {
        window.location.href = new URL("login", this.host);
    }

    /** 
    * Logs out from the web app.
    */
    logout() {
        fetch(new URL("logout", this.host), {
            method: "GET",
            credentials: "include"
        })
        .then(this.checkStatusCode)
        .catch(error => this.catchError(error));
    }

    /** 
    * Checks if the status code of a `Response` is ok.
    * @param {Response} response    `Response` object from an HTTP request.
    * @return {Response}            Same object as the parameter.
    */
    checkStatusCode(response) {
        if (!response.ok) throw new Error(response.status);
        return response;
    }

    /** 
    * In case of an 401 error (unauthorized), call the login function.
    * Otherwise, log the error.
    */
    catchError(error) {
        if (error.message == 401) {
            this.login();
        } else {
            console.log(error);
        }
    }
}