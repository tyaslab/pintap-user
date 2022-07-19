export class ValidationError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export const serverErrorHandler = (err: any) => {
  if (err.statusCode !== undefined) {
    return {
      statusCode: err.statusCode,
      body: JSON.stringify({
        'message': err.message,
        'code': err.statusCode
      })
    }    
  }

  console.error(err)
  return {
    statusCode: 500,
    body: JSON.stringify({
      'message': 'An error occured',
      'code': 500
    })
  }
}
