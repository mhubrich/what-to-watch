const DynamoDB = require("aws-sdk/clients/dynamodb");
const Database = require("./database");
const { Record, RecordMeta } = require("../utils/record");
const { Movie, MovieType } = require("../utils/movie");
const RecordList = require("../utils/recordlist");


class DynamoDatabase extends Database {
    constructor(tableName, region="us-west-2") {
        super();
        this.tableName = tableName;
        this.region = region;
        this.client = new DynamoDB({ region: this.region });
    }
    
    getAll() {
        const params = { TableName: this.tableName };
        this.client.scan(params, function(err, data) {
            if (err) {
                console.log(err);
                return;
            } else {
                const recordList = new RecordList();
                for (const item of data.Items) {
                    recordList.add(this.toRecord(item));
                }
                return recordList;
            }
        });
    }

    add(record) {
        const params = {
            TableName: this.tableName,
            Item: this.fromRecord(record)
        };
        this.client.putItem(params, function(err, data) {
            if (err) {
                console.log(err);
                return false;
            } else {
                return true;
            }
        });
    }

    remove(id) {
        const params = {
            TableName: this.tableName,
            Key: { id: {S: id} }
        };
        this.client.deleteItem(params, function(err, data) {
            if (err) {
                console.log(err);
                return false;
            } else {
                return true;
            }
        });
    }

    toRecord(data) {
        const obj = DynamoDB.Converter.unmarshall(data);
        const movie = new Movie(obj.movie_id,
                                obj.movie_name,
                                new MovieType(obj.movie_type),
                                obj.movie_poster,
                                obj.movie_rating,  // TODO need to cast to number?
                                obj.movie_summary);
        const meta = new RecordMeta(obj.id,
                                    obj.user_id,
                                    obj.date_added);
        return new Record(movie, meta);
    }

    fromRecord(record) {
        return {
            id: {S: record.meta.id},
            date_added: {S: record.meta.dateAdded},
            user_id: {S: record.meta.userId},
            movie_id: {S: record.movie.id},
            movie_name: {S: record.movie.name},
            movie_type: {S: record.movie.type.name},
            movie_poster: {S: record.movie.poster},
            movie_rating: {N: record.movie.rating.toString()},
            movie_summary: {S: record.movie.summary},
        }
    }
}


module.exports = DynamoDatabase;