class Record {
    constructor(movie, userId, dateAdded) {
        this.movie = movie;
        if (userId && dateAdded) {
            this.addUser(userId, dateAdded);
        }
    }

    addUser(userId, dateAdded) {
        this.userId = userId;
        this.dateAdded = dateAdded;
    }
}