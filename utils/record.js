class RecordMeta {
    constructor(userId, dateAdded, id) {
        this.userId = userId;
        this.dateAdded = dateAdded;
        if (typeof id !== "undefined") {
            this.id = id;
        }
    }
}

class Record {
    constructor(movie, meta) {
        this.movie = movie;
        if (typeof meta !== "undefined") {
            this.meta = meta;
        }
    }
}


module.exports = { Record, RecordMeta };