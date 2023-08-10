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
        delete this.records[i];
    }

    length() {
        return this.records.length;
    }
}