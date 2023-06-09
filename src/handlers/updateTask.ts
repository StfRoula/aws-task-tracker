import { APIGatewayProxyHandler } from 'aws-lambda';
import { updateTask } from '../dynamodb';
import { SNS } from 'aws-sdk';
const sns = new SNS();

export const updateTaskHandler: APIGatewayProxyHandler = async (event) => {
    const { id } = event.pathParameters;
    const updates = JSON.parse(event.body);

    try {
        await updateTask(id, updates);
        const params = {
            Message: `Task ${id} has been updated`,
            TopicArn: '',
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


