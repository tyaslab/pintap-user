import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { userService } from '../../bootstrap'

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const data = await userService.getUserList()
  try {
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
