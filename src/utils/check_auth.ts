export const checkAuth = (user: any, mustAdmin: boolean) => {
  if (user == 'expired') {
    return {
      statusCode: 401,
      body: JSON.stringify({
        'message': 'Token expired',
        'code': 4011
      })
    }
  } else if (user == 'invalid-token') {
    return {
      statusCode: 401,
      body: JSON.stringify({
        'message': 'Invalid token',
        'code': 4012
      })
    }
  }

  if (mustAdmin && !user.isAdmin) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        'message': 'You are not allowed',
        'code': 403
      })
    }
  }

  return null
}
