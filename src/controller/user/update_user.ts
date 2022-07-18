import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { userService } from '../../bootstrap';
import { serverErrorHandler } from '../../utils/error_handler';

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const parsedBody = JSON.parse(_event.body || '')
    const result = userService.createUser(parsedBody)
    console.log(result)
    return {
      statusCode: 204,
      body: ''
    }
  } catch (err) {
    return serverErrorHandler(err)
  }
}
