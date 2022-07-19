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

    const result: any[] = []

    data?.forEach((item) => {
      result.push({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt
      })
    })

    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    }

    return response
  } catch (err) {
    return {
      statusCode: 500,
      body: 'An error occured',
    }
  }
};
