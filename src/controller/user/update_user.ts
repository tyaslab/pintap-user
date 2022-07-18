import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { userService } from '../../bootstrap';
import { serverErrorHandler } from '../../utils/error_handler';

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { id }: any = _event.pathParameters
    let user = await userService.getUserDetail(id)
    if (user == null) {
      return {
        statusCode: 400,
        body: JSON.stringify('User not found')
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
