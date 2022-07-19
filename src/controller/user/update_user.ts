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
    let user = await userService.getUserDetail(id)
    if (user == null) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          'message': 'User not found',
          'code': 404
        })
      }
    }

    if (!authUser.isAdmin && authUser.id != user.id) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          'message': 'You are not allowed',
          'code': 403
        })
      }
    }

    const parsedBody = JSON.parse(_event.body || '')

    user = {
      ...user,
      ...parsedBody,
      id: user.id
    }

    await userService.updateUser(user)

    const response = {
      statusCode: 204,
      body: ''
    }
    return response
  } catch (err) {
    return serverErrorHandler(err)
  }
}
