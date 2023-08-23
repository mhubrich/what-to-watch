/**
 * This file implements two functions to create a
 * 1) DynamoDB table storing all movie records (`createMoviesTable`).
 * 2) DynamoDB table storing all user sessions (`createUsersTable`).
 */
const DynamoDB = require("aws-sdk/clients/dynamodb");
const config = require('config');


/**
 * Uses an instance of the AWS DynamoDB SDK to create a new table with the given parameters.
 * @param {DynamoDB} client Instance of AWS DynamoDB SDK.
 * @param {Object} params   Table parameters.
 */
function createTable(client, params) {
    client.createTable(params, (err, data) => {
        if (err) {
            console.log(`Error creating table ${params.TableName}:`, err);
        } else {
            console.log(`Table ${params.TableName} created successfully:`, data);
        }
    });
}

/**
 * Creates a new DynamoDB table for movie records.
 */
function createMoviesTable() {
    const TABLE = config.get("database.movies.table");
    const REGION = config.get("database.movies.region");
    
    const params = {
        TableName: TABLE,
        AttributeDefinitions: [
            {
                AttributeName: "id",
                AttributeType: "S",
            },
        ],
        KeySchema: [
            {
                AttributeName: "id",
                KeyType: "HASH",
            },
        ],
        BillingMode: "PAY_PER_REQUEST",
    };

    const client = new DynamoDB({ region: REGION });
    createTable(client, params)
}

/**
 * Creates a new DynamoDB table for user sessions.
 */
function createUsersTable() {
    const TABLE = config.get("database.users.table");
    const REGION = config.get("database.users.region");
    
    const params = {
        TableName: TABLE,
        AttributeDefinitions: [
            {
                AttributeName: "sessionId",
                AttributeType: "S",
            },
        ],
        KeySchema: [
            {
                AttributeName: "sessionId",
                KeyType: "HASH",
            },
        ],
        BillingMode: "PAY_PER_REQUEST",
    };

    const client = new DynamoDB({ region: REGION });
    createTable(client, params)
}

createMoviesTable();
createUsersTable();