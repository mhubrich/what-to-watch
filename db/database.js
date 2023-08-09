class Database {
    constructor() {
        if (this.constructor == Database) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    getAllMovies() {
        throw new Error("Method 'getAllMovies()' must be implemented.");
    }

    addMovie() {
        throw new Error("Method 'addMovie()' must be implemented.");
    }

    removeMovie() {
        throw new Error("Method 'removeMovie()' must be implemented.");
    }
}

module.exports = Database;