import { DynamoDB } from 'aws-sdk';

const client = new DynamoDB.DocumentClient();
export default client;
