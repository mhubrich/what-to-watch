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

    async postMovie(movie, cb) {
        fetch(new URL("movies", this.host), {
            method: "POST",
            credentials: "include",
            body: movie,
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            return response.json();
        });
    }

    async deleteMovie(id, cb) {
        fetch(new URL("movies/" + id, HOST), {
            method: "DELETE",
            credentials: "include"
        })
        .then(response => {
            return response.json();
        });
    }

    async searchAll(query, cb) {
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

    async searchId(id, cb) {
        fetch(new URL("search/" + id, this.host), {
            method: "GET",
            credentials: "include"
        })
        .then(response => { return response.json() })
        .then(cb)
        .catch((error) => console.log(error));
    }
}