const { Movie } = require("./movie");


class RecordMeta {
    constructor(id, userId, dateAdded) {
        this.id = id;
        this.userId = userId;
        this.dateAdded = dateAdded;
    }

    static isValid(obj) {
        if (!obj.hasOwnProperty('id')) {
            return false;
        }
        if (!obj.hasOwnProperty('userId')) {
            return false;
        }
        if (!obj.hasOwnProperty('dateAdded')) {
            return false;
        }
        return true;
    }
}

class Record {
    constructor(movie, meta) {
        this.movie = movie;
        if (typeof meta !== "undefined") {
            this.meta = meta;
        }
    }

    static isValid(obj) {
        if (!obj.hasOwnProperty('movie')) {
            return false;
        }
        if (!Movie.isValid(obj.movie)) {
            return false;
        }
        if (obj.hasOwnProperty('meta') && !RecordMeta.isValid(obj.meta)) {
            return false;
        }
        return true;
    }
}


module.exports = { Record, RecordMeta };