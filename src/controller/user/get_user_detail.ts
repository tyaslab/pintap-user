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

    const response = {
      statusCode: 200,
      body: JSON.stringify(item),
    }
    return response
  } catch (err) {
    return serverErrorHandler(err)
  }
}
