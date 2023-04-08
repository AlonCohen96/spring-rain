exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            apiKey: process.env.REACT_APP_API_KEY
        }),
    }
}
