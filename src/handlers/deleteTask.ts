import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from "aws-lambda";
import {deleteTask} from '../dynamodb';
import { SNS } from 'aws-sdk';
const sns = new SNS();

export const deleteTaskHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.pathParameters) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing path parameters' }),
        };
    }

    const { id } = event.pathParameters;

    try {
        await deleteTask(id!)
        const params = {
            Message: `Task ${id} has been deleted.`,
            TopicArn: 'arn:aws:sns:us-east-1:044267579881:TaskManagerTopic2',
        };

        await sns.publish(params).promise();

        return {
            statusCode: 204,
            body: JSON.stringify({ message: 'Task deleted' }),
        }
    }
    catch (e) {
        const error = e as Error;
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }

}