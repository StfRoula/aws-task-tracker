import {Task} from './type'
import client from './dbClient';

export async function createTask(task: Task): Promise<void> {
    const params = {
        TableName: 'Tasks2',
        Item: task,
    };

    try {
        await client.put(params).promise();
    } catch (error) {
        console.error(`Error creating task: `, error);
    }
}


export async function getTask(id: string): Promise<Task | null> {
    const params = {
        TableName: 'Tasks2',
        Key: { id },
    };

    try {
        const result = await client.get(params).promise();
        if (!result.Item) {
            console.error(`Task ${id} not found.`);
            return null;
        }
        return result.Item as Task;
    } catch (error) {
        console.error(`Error getting task ${id}: `, error);
    }

    return null;
}



export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const updateExpression = Object.keys(updates).map(key => `${key} = :${key}`).join(', ');
    const expressionAttributeValues = Object.entries(updates).reduce((acc, [key, value]) => ({ ...acc, [`:${key}`]: value }), {});

    const params = {
        TableName: 'Tasks2',
        Key: { id },
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW',
    };

    try {
        await client.update(params).promise();
    } catch (error) {
        console.error(`Error updating task ${id}: `, error);
    }
}


export async function deleteTask(id: string): Promise<void> {
    const params = {
        TableName: 'Tasks2',
        Key: { id },
    };

    try {
        await client.delete(params).promise();
    } catch (error) {
        console.error(`Error deleting task ${id}: `, error);
    }
}

export async function listTasks(): Promise<Task[]> {
    const params = {
        TableName: 'Tasks2',
    }
    try {
        const taskList = await client.scan(params).promise()
        return taskList.Items as Task[]
    }
    catch (error) {
        console.error(`Error listing tasks: `, error)
        return [];
    }
}


