import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import {createTask} from '../dynamodb';



export const createTaskHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body || '{}');

    if (!body.description || !body.assignee || !body.dueDate || !body.taskStatus) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing parameters in request body' }),
        };
    }

    const task = {
        id: Math.random().toString(36).substring(2),
        description: body.description,
        assignee: body.assignee,
        dueDate: body.dueDate,
        taskStatus: body.taskStatus,
    };

    try {
        await createTask(task);

        return {
            statusCode: 200,
            body: JSON.stringify(task),
        };
    } catch (error) {
        console.error(`Error creating task: `, error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
