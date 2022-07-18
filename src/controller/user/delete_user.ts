import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { userService } from '../../bootstrap';
import { serverErrorHandler } from '../../utils/error_handler';

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { id }: any = _event.pathParameters
    const item = await userService.getUserDetail(id)
    if (item == null) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          'message': 'User not found',
          'code': 404
        })
      }
    }

    await userService.deleteUser(id)

    const response = {
      statusCode: 204,
      body: ''
    }
    return response
  } catch (err) {
    return serverErrorHandler(err)
  }
}
