import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { userService } from '../../bootstrap';

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = _event.pathParameters
    const item = userService.getUserDetail(id)
    if (item == null) {
      return {
        statusCode: 400,
        body: JSON.stringify('user not found')
      }
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(item),
    };
    return response
  } catch (err) {
    return {
      statusCode: 500,
      body: 'An error occured',
    };
  }
};
