export const serverErrorHandler = (err: any) => {
    console.error(err)
    return {
        statusCode: 500,
        body: JSON.stringify('An error occured')
    }
}
