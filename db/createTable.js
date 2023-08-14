const DynamoDB = require("aws-sdk/clients/dynamodb");


const REGION = "us-west-2";


const params = {
    TableName: "What-To-Watch",
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
client.createTable(params, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Table Created", data);
    }
});