import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'


const baseClient = new DynamoDBClient({
    region: process.env.AWS_REGION
});

export const dynamo = DynamoDBDocumentClient.from(baseClient);