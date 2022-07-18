import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { userService } from '../../bootstrap';
import { serverErrorHandler } from '../../utils/error_handler';


export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const parsedBody = JSON.parse(_event.body || '')
    await userService.createUser(parsedBody)
    return {
      statusCode: 204,
      body: ''
    }
  } catch (err) {
    return serverErrorHandler(err)
  }
}
