import {APIGatewayProxyHandlerV2, APIGatewayTokenAuthorizerHandler} from "aws-lambda";


export const handlerLogIn = async (event: object, context: object) => {
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