import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from "aws-lambda";
import {listTasks} from "../dynamodb";
export const listTasksHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const tasks = await listTasks();
        return {
            statusCode: 200,
            body: JSON.stringify(tasks)

        }
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Error while listing tasks"})

        }
    }

}