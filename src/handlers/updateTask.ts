import { APIGatewayProxyHandler } from 'aws-lambda';
import { updateTask } from '../dynamodb';
import { SNS } from 'aws-sdk';
const sns = new SNS();

export const updateTaskHandler: APIGatewayProxyHandler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing request body' }),
        };
    }

    const updates = JSON.parse(event.body);
    if (!event.pathParameters) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing path parameters' }),
        };
    }

    const { id } = event.pathParameters;
    try {
        await updateTask(id!, updates);
        const params = {
            Message: `Task ${id} has been updated`,
            TopicArn: 'arn:aws:sns:us-east-1:044267579881:TaskManagerTopic',
        };

        await sns.publish(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Task updated' }),
        };
    } catch (error) {
        console.error(`Error updating task: `, error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};


