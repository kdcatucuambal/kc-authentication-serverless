
import {CognitoIdentityProviderClient, InitiateAuthCommand} from "@aws-sdk/client-cognito-identity-provider";
import crypto from 'crypto';

import {KcRequestProxyEvent} from "../models/Handler";

export const handlerLogIn: KcRequestProxyEvent = async (event, context) => {
    console.log('Event: ' + JSON.stringify(event));
    console.log('Context: ' + JSON.stringify(context));


    const region = process.env.AUTH_AWS_REGION;
    const clientId = process.env.AUTH_CLIENT_ID;
    const secretClient = process.env.AUTH_SECRET_CLIENT;

    const client = new CognitoIdentityProviderClient({region});

    const username: string = event.body.username;
    const password: string = event.body.password;

    console.log("username: " + username);
    console.log("password: " + password);

    const hash = crypto.createHmac('sha256', secretClient).update(`${username}${clientId}`).digest('base64');

    const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
            SECRET_HASH: hash
        }
    });

    try {
        const response = await client.send(command);
        response.AuthenticationResult
        if (!response.AuthenticationResult) {
            //Authentication failed
            throw new Error("Authentication failed");
        }
        return {
            statusCode: 201,
            body: {
                idToken: response.AuthenticationResult.IdToken,
                accessToken: response.AuthenticationResult.AccessToken,
                refreshToken: response.AuthenticationResult.RefreshToken
            },
            headers: {
                "roadmap": "kc-authentication-app",
            }
        };

    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        client.destroy();
    }
}