import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { userService } from '../../bootstrap';
import { serverErrorHandler } from '../../utils/error_handler';


export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const {name, password, isAdmin}: any = JSON.parse(_event.body || '')
    const loginInfo = await userService.loginUser(name, password, isAdmin)
    return {
      statusCode: 200,
      body: JSON.stringify(loginInfo)
    }
  } catch (err) {
    return serverErrorHandler(err)
  }
}
