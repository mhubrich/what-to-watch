class RecordMeta {
    constructor(userId, dateAdded) {
        this.userId = userId;
        this.dateAdded = dateAdded;
    }
}

class Record {
    constructor(movie, meta) {
        this.movie = movie;
        if (meta) {
            this.meta = meta;
        }
    }
}


module.exports = { Record, RecordMeta };