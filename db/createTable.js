const DynamoDB = require("aws-sdk/clients/dynamodb");


const REGION = "us-west-2";


const params = {
    TableName: "What-To-Watch",
    AttributeDefinitions: [
        {
            AttributeName: "id",
            AttributeType: "N",
        },
        // {
        //     AttributeName: "date_added",
        //     AttributeType: "S",
        // },
        // {
        //     AttributeName: "user_id",
        //     AttributeType: "S",
        // },
        // {
        //     AttributeName: "movie_id",
        //     AttributeType: "S",
        // },
        // {
        //     AttributeName: "movie_name",
        //     AttributeType: "S",
        // },
        // {
        //     AttributeName: "movie_type",
        //     AttributeType: "S",
        // },
        // {
        //     AttributeName: "movie_poster",
        //     AttributeType: "S",
        // },
        // {
        //     AttributeName: "movie_rating",
        //     AttributeType: "N",
        // },
        // {
        //     AttributeName: "movie_summary",
        //     AttributeType: "S",
        // },
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