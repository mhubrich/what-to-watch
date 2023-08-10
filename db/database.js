class Database {
    constructor() {
        if (this.constructor == Database) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    getAllRecords() {
        throw new Error("Method 'getAllRecords()' must be implemented.");
    }

    addRecord(record) {
        throw new Error("Method 'addRecord()' must be implemented.");
    }

    removeRecord(record) {
        throw new Error("Method 'removeRecord()' must be implemented.");
    }
}

module.exports = Database;