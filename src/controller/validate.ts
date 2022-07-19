import { decodeAccessToken } from "../utils/token"
import { TokenExpiredError } from "jsonwebtoken"

export const handler = async (event: any, _: any) => {
  const authorizationToken = event.authorizationToken.split(' ')
  if (authorizationToken.length !== 2 || authorizationToken[0] !== 'Bearer' || authorizationToken[1].length === 0) {
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }

  try {
    const user = await decodeAccessToken(authorizationToken[1])
    return generatePolicy(user, 'Allow', event.methodArn)
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return generatePolicy('expired', 'Allow', event.methodArn)  // TODO: should intercept response
    } else {
      return generatePolicy('invalid-token', 'Allow', event.methodArn)  // TODO: should intercept response
    }
  }
}

const generatePolicy = (principalId: any, effect: any, resource: any) => {
  let authResponse: any = {}

  authResponse.principalId = principalId

  if (effect && resource) {
    authResponse.policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }

  return authResponse
}
