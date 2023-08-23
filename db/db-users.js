const DynamoDBStore = require("dynamodb-store");
const config = require("config");


/**
 * Wrapper class which creates an instance of `DynamoDBStore` with desired configs.
 * @class DBUsers
 */
class DBUsers {
    constructor() {
        if (this.constructor == DBUsers) {
            throw new Error("Use factory method `createInstance` instead.");
        }
    }

    /**
     * Factory method creates an instance of `DynamoDBStore` with desired configs.
     * @static
     * @return {DynamoDBStore}  New instance of `DynamoDBStore`.
     */
    static createInstance() {
        return new DynamoDBStore({
            table: { name: config.get("database.users.table") },
            dynamoConfig: {
                accessKeyId: config.get("database.users.accessKeyId"),
                secretAccessKey: config.get("database.users.secretAccessKey"),
                region: config.get("database.users.region")
            },
            // Time to live = 7 day (removes any session data older than ttl)
            ttl: 1000 * 60 * 60 * 24 * 7
        });
    }
}


module.exports = DBUsers;