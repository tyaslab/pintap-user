import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { userService } from '../../bootstrap';
import { serverErrorHandler } from '../../utils/error_handler';
import { checkAuth } from '../../utils/check_auth';


export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const authUser = _event.requestContext.authorizer?.principalId
    const resultCheckAuth = checkAuth(authUser, true)
    if (resultCheckAuth) {
      return resultCheckAuth
    }

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
