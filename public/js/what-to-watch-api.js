export default class WhatToWatchAPI {
    constructor(host) {
        this.host = host;
        this.cache = [];
        this.stale = true;
    }

    async getMovies(cb) {
        new Promise((resolve) => {
            if (this.stale) {
                this.cache = fetch(new URL("movies", this.host), {
                    method: "GET",
                    credentials: "include"
                })
                .then(response => { return response.json() });
                this.stale = false;
            }
            resolve(this.cache);
        })
        .then(cb)
        .catch((error) => console.log(error));
    }

    async postRecord(record) {
        fetch(new URL("movies", this.host), {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(record),
            headers: { "Content-Type": "application/json" }
        })
        .then(this.stale = true)
        .catch((error) => console.log(error));
    }

    async deleteRecord(id) {
        fetch(new URL("movies/" + id, this.host), {
            method: "DELETE",
            credentials: "include"
        })
        .then(this.stale = true)
        .catch((error) => console.log(error));
    }

    async searchMovies(query, cb) {
        const url = new URL("search", this.host);
        url.searchParams.append("q", query);
        fetch(url, {
            method: "GET",
            credentials: "include"
        })
        .then(response => { return response.json() })
        .then(cb)
        .catch((error) => console.log(error));
    }

    async searchMovie(id) {
        return fetch(new URL("search/" + id, this.host), {
            method: "GET",
            credentials: "include"
        })
        .then(response => { return response.json() })
        .catch((error) => console.log(error));
    }
}