import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { userService } from '../../bootstrap';
import { serverErrorHandler } from '../../utils/error_handler';


export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const parsedBody = JSON.parse(_event.body || '')
    userService.createUser(parsedBody)

    return {
      statusCode: 200,
      body: parsedBody
    }
  } catch (err) {
    return serverErrorHandler()
  }
}
