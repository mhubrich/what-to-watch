class Database {
    constructor() {
        if (this.constructor == Database) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    getAll() {
        throw new Error("Method 'getAll()' must be implemented.");
    }

    add(record) {
        throw new Error("Method 'add()' must be implemented.");
    }

    remove(record) {
        throw new Error("Method 'remove()' must be implemented.");
    }
}


module.exports = Database;