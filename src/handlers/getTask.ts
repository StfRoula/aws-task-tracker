import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from "aws-lambda";
import {getTask} from "../dynamodb";

export const getTaskHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.pathParameters) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing path parameters' }),
        };
    }

    const { id } = event.pathParameters;

    try {
      const task = await getTask(id!);

      return {
          statusCode: 200,
          body: JSON.stringify(task),
      };

  }
    catch (e) {
        const error = e as Error;
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }

}