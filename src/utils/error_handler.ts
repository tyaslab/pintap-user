export const serverErrorHandler = (err: any) => {
  console.error(err)
  return {
    statusCode: 500,
    body: JSON.stringify({
      'message': 'An error occured',
      'code': 500
    })
  }
}
