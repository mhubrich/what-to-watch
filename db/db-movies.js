const DynamoDB = require("aws-sdk/clients/dynamodb");
const config = require("config");
const { Record, RecordMeta } = require("../utils/record");
const { Movie, MovieType } = require("../utils/movie");


/**
 * Implements three functions (`getAll`, `add` and `remove`) to perform operations
 * on a DynamoDB instance.
 * @class DBMovies
 */
class DBMovies {
    /**
     * Creates an instance of DBMovies.
     */
    constructor() {
        this.tableName = config.get("database.movies.table");
        this.client = new DynamoDB({
            region: config.get("database.movies.region"),
            accessKeyId: config.get("database.movies.accessKeyId"),
            secretAccessKey: config.get("database.movies.secretAccessKey")
         });
    }
    
    /**
     * Retrieves all records in the database table.
     * @return {List}  List of `Record`s.
     */
    async getAll() {
        const params = { TableName: this.tableName };
        const data = await this.client.scan(params).promise();
        const recordList = [];
        for (const item of data.Items) {
            recordList.push(this.toRecord(item));
        }
        return recordList;
    }

    /**
     * Adds a new `Record` to the database table.
     * @param {`Record`} record The record to be stored.
     * @return {Promise}        Promise of the `put` database operation.
     */
    add(record) {
        const params = {
            TableName: this.tableName,
            Item: this.fromRecord(record)
        };
        return this.client.putItem(params).promise();
    }

    /**
     * Removes a `Record` from the database table.
     * @param {String} id   Identifier of the record to be removed.
     * @return {Promise}    Promise of the `delete` database operation.
     */
    remove(id) {
        const params = {
            TableName: this.tableName,
            Key: { id: {S: id} }
        };
        return this.client.deleteItem(params).promise();
    }

    /**
     * Converts an instance of class `Record` to a DynamoDB item (JSON).
     * @param {`Record`} record Instance of `Record`.
     * @return {Object}         Record converted to a DynamoDB item.
     */
    fromRecord(record) {
        return {
            id: {S: record.meta.id},
            date_added: {S: record.meta.dateAdded},
            user_id: {S: record.meta.userId},
            movie_id: {S: record.movie.id},
            movie_name: {S: record.movie.name},
            movie_type: {S: record.movie.type.name},
            // A small number of movies do not have images on IMDb
            movie_poster: record.movie.poster === undefined ? {"NULL": true} : {S: record.movie.poster},
            movie_year: {N: record.movie.year.toString()},
            movie_imdb: {S: record.movie.imdb},
            movie_rating: {N: record.movie.rating.toString()},
            movie_summary: {S: record.movie.summary},
            movie_runtime: {S: record.movie.runtime},
            movie_genre: {S: record.movie.genre.toString()},
        }
    }

    /**
     * Converts a DynamoDB item (JSON) to an instance of class `Record`.
     * @param {Object} data A DynamoDB item.
     * @return {`Record`}   Item converted to `Record`.
     */
    toRecord(data) {
         // Flattens the object
        const obj = DynamoDB.Converter.unmarshall(data);
        // Ensures backwards compatibility for MovieType
        const typeMovie = obj.movie_type == "TV Show" ? "Show" : obj.movie_type;
        // Create a new `Movie`, `RecordMeta` and `Record` objects
        const movie = new Movie(obj.movie_id,
                                obj.movie_name,
                                new MovieType(typeMovie),
                                obj.movie_poster,
                                obj.movie_year,
                                obj.movie_imdb,
                                obj.movie_rating,
                                obj.movie_summary,
                                obj.movie_runtime,
                                obj.movie_genre.split(","));
        const meta = new RecordMeta(obj.id,
                                    obj.user_id,
                                    obj.date_added);
        return new Record(movie, meta);
    }
}


module.exports = DBMovies;