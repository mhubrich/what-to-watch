class RecordList {
    constructor() {
        this.records = [];
    }

    add(record) {
        this.records.push(record);
    }

    get(i) {
        return this.records[i];
    }

    getAll() {
        return this.records;
    }

    remove(i) {
        this.records.splice(i, 1);
    }

    length() {
        return this.records.length;
    }
}


module.exports = RecordList;