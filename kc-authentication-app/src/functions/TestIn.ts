
export const handlerTestIn = async (event: string, context: string) => {
    console.log('Event: ' + JSON.stringify(event));
    console.log('Context: ' + JSON.stringify(context));
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World!',
            input: event,
        }, null, 2),
    };
}