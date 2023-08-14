const { Movie } = require("./movie");
const { Record, RecordMeta } = require("./record");


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

    // TODO are those two methods needed?
    static toJSON(recordList) {
        return JSON.stringify(recordList);
    }

    static fromJSON(data) {
        const recordList = new RecordList();
        for (const rec of JSON.parse(data).records) {
            const movie = new Movie(rec.movie.id,
                                    rec.movie.name,
                                    rec.movie.type,
                                    rec.movie.poster,
                                    rec.movie.rating,
                                    rec.movie.summary);
            const recordMeta = new RecordMeta(rec.meta.id,
                                              rec.meta.userId,
                                              rec.meta.dateAdded);
            const record = new Record(movie, recordMeta);
            recordList.add(record);
        }
        return recordList;
    }
}


module.exports = RecordList;