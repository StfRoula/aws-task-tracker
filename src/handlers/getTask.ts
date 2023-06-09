import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from "aws-lambda";
import {getTask} from "../dynamodb";

export const getTaskHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { id } = event.pathParameters;
  try {
      const task = await getTask(id);

      return {
          statusCode: 200,
          body: JSON.stringify(task),
      };

  }
  catch (e) {
      return {
          statusCode: 404,
          body: JSON.stringify({
              message: e.message
          })
      }
  }
}