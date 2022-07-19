import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { userService } from '../../bootstrap'
import { checkAuth } from '../../utils/check_auth';

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const authUser = _event.requestContext.authorizer?.principalId
    const resultCheckAuth = checkAuth(authUser, false)
    if (resultCheckAuth) {
      return resultCheckAuth
    }
  
    const data = await userService.getUserList()

    const response = {
      statusCode: 200,
      body: JSON.stringify(data),
    }

    return response
  } catch (err) {
    return {
      statusCode: 500,
      body: 'An error occured',
    }
  }
};
