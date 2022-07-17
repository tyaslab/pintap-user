export const serverErrorHandler = () => {
    return {
        statusCode: 500,
        body: 'An error occured'
    }
}
