import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/plain'
        },
        body: 'pong'
    }
}
