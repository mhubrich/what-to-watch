class Record {
    constructor(userId, dateAdded) {
        this.userId = userId;
        this.dateAdded = dateAdded;
    }
}

class ListItem {
    constructor(movie, record) {
        this.movie = movie;
        this.record = record;
    }
}