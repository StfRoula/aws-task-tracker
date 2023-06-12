import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from "aws-lambda";
import {deleteTask} from '../dynamodb';
import { SNS } from 'aws-sdk';
const sns = new SNS();

export const deleteTaskHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { id } = event.pathParameters;
    try {
        await deleteTask(id)
        const params = {
            Message: `Task ${id} has been deleted.`,
            TopicArn: 'arn:aws:sns:us-east-1:044267579881:TaskManagerTopic',
        };

        await sns.publish(params).promise();

        return {
            statusCode: 204,
            body: JSON.stringify({ message: 'Task deleted' }),
        }
    }
    catch (e) {
        return {
            statusCode: 500,
            body: e.message
        }
    }
}