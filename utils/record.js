const { Movie } = require("./movie");


/**
 * Helper class to hold additional information related to a `Record`.
 * @class RecordMeta
 */
class RecordMeta {
    /**
     * Creates an instance of `RecordMeta`.
     * @param {String} id           Unique identifier of the record.
     * @param {String} userId       Identifier of the user who created the record.
     * @param {String} dateAdded    Date when record was created.
     */
    constructor(id, userId, dateAdded) {
        this.id = id;
        this.userId = userId;
        this.dateAdded = dateAdded;
    }

    /**
     * Verifies if the given object has all properties of class `RecordMeta`.
     * @static
     * @param {Object} obj  The object to test.
     * @return {Boolean}    True, if `obj` has all properties of class `RecordMeta`, false otherwise.
     */
    static isValid(obj) {
        if (!obj.hasOwnProperty('id')) {
            return false;
        }
        if (!obj.hasOwnProperty('userId')) {
            return false;
        }
        if (!obj.hasOwnProperty('dateAdded')) {
            return false;
        }
        return true;
    }
}

/**
 * Helper class to hold a `Movie` and `RecordMeta` together.
 * @class Record
 */
class Record {
    /**
     * Creates an instance of `Record`.
     * @param {`Movie`} movie       An instance of `Movie`.
     * @param {`RecordMeta`} [meta] (Optional) An instance of `RecordMeta`.
     */
    constructor(movie, meta) {
        this.movie = movie;
        if (typeof meta !== "undefined") {
            this.meta = meta;
        }
    }

    /**
     * Verifies if the given object has all properties of class `Record`.
     * @static
     * @param {Object} obj  The object to test.
     * @return {Boolean}    True, if `obj` has all properties of class `Record`, false otherwise.
     */
    static isValid(obj) {
        if (!obj.hasOwnProperty('movie')) {
            return false;
        }
        if (!Movie.isValid(obj.movie)) {
            return false;
        }
        if (obj.hasOwnProperty('meta') && !RecordMeta.isValid(obj.meta)) {
            return false;
        }
        return true;
    }
}


module.exports = { Record, RecordMeta };