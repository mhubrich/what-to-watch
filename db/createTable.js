const DynamoDB = require("aws-sdk/clients/dynamodb");
const config = require('config');


function createTable(client, params) {
    client.createTable(params, (err, data) => {
        if (err) {
            console.log(`Error creating table ${params.TableName}:`, err);
        } else {
            console.log(`Table ${params.TableName} created successfully:`, data);
        }
    });
}

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