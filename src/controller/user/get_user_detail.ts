import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { userService } from '../../bootstrap';
import { checkAuth } from '../../utils/check_auth';
import { serverErrorHandler } from '../../utils/error_handler';

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const authUser = _event.requestContext.authorizer?.principalId
    const resultCheckAuth = checkAuth(authUser, false)
    if (resultCheckAuth) {
      return resultCheckAuth
    }

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

    const result = {
      id: item.id,
      name: item.name,
      createdAt: item.createdAt
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    }
    return response
  } catch (err) {
    return serverErrorHandler(err)
  }
}
