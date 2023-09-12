export default class WhatToWatchAPI {
    constructor(host) {
        this.host = host;
        this.cache = [];
        this.stale = true;
    }

    async getMovies() {
        return new Promise(resolve => {
            if (this.stale) {
                this.cache = fetch(new URL("movies", this.host), {
                    method: "GET",
                    credentials: "include"
                })
                .then(this.checkStatusCode)
                .then(response => {
                    this.stale = false; 
                    return response.json()
                });
            }
            resolve(this.cache);
        })
        .catch(error => this.catchError(error));
    }

    async postRecord(record) {
        fetch(new URL("movies", this.host), {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(record),
            headers: { "Content-Type": "application/json" }
        })
        .then(this.checkStatusCode)
        .then(this.stale = true)
        .catch(error => this.catchError(error));
    }

    async deleteRecord(id) {
        await fetch(new URL("movies/" + id, this.host), {
            method: "DELETE",
            credentials: "include"
        })
        .then(this.checkStatusCode)
        .then(this.stale = true)
        .catch(error => this.catchError(error));
    }

    async searchMovies(query) {
        const url = new URL("search", this.host);
        url.searchParams.append("q", query);
        return fetch(url, {
            method: "GET",
            credentials: "include"
        })
        .then(this.checkStatusCode)
        .then(response => { return response.json() })
        .catch(error => this.catchError(error));
    }

    async searchMovie(id) {
        return fetch(new URL("search/" + id, this.host), {
            method: "GET",
            credentials: "include"
        })
        .then(this.checkStatusCode)
        .then(response => { return response.json() })
        .catch(error => this.catchError(error));
    }

    login() {
        window.location.href = new URL("login", this.host);
    }

    logout() {
        fetch(new URL("logout", this.host), {
            method: "GET",
            credentials: "include"
        })
        .then(this.checkStatusCode)
        .catch(error => this.catchError(error));
    }

    checkStatusCode(response) {
        if (!response.ok) throw new Error(response.status);
        return response;
    }

    catchError(error) {
        if (error.message == 401) {
            this.login();
        } else {
            console.log(error);
        }
    }
}