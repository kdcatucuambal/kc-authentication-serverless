import {APIGatewayProxyHandlerV2, APIGatewayTokenAuthorizerHandler} from "aws-lambda";

import {CognitoIdentityProviderClient, InitiateAuthCommand} from "@aws-sdk/client-cognito-identity-provider";


export const handlerLogIn = async (event: any, context: any) => {
    console.log('Event: ' + JSON.stringify(event));
    console.log('Context: ' + JSON.stringify(context));

    const client = new CognitoIdentityProviderClient({region: 'us-east-1'});
    const clientId = "1nbd430stjlirh280e7gkvovfm";


    const username: string = event["username"];
    const password: string = event["password"];

    console.log("username: " + username);
    console.log("password: " + password);

    const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password
        }
    });

    try {
        const response = await client.send(command);

        if (!response.AuthenticationResult) {
            //Authentication failed
            throw new Error("Authentication failed.");
        } else {
            return response.AuthenticationResult.AccessToken;
        }

    }catch (error){
        console.log(error);
        throw error;
    } finally {
        client.destroy();
    }
}