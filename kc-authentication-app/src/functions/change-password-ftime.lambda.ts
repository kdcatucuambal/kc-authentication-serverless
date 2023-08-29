import {KcRequestProxyEvent} from "../models/handler.model";
import {AdminSetUserPasswordRequest, AuthChangePassword} from "../models/auth-login.model";
import {CognitoIdentityProviderClient, AdminSetUserPasswordCommand} from "@aws-sdk/client-cognito-identity-provider";

export const handlerChangePassword: KcRequestProxyEvent<AdminSetUserPasswordRequest, string> = async (event, context)=>{
    console.log('Event: ' + JSON.stringify(event));
    console.log('Context: ' + JSON.stringify(context));

    const {username, permanent, password, userPoolId} = event.body;
    const region = process.env.AUTH_AWS_REGION;

    const client = new CognitoIdentityProviderClient({region});

    const command = new AdminSetUserPasswordCommand({
        Password: password,
        Permanent: permanent,
        UserPoolId: userPoolId,
        Username: username
    });

    try {
        const response = await client.send(command);
        console.log(response);
        return {
            statusCode: 201,
            body: "Password changed successfully",
            headers: {
                "roadmap": "kc-authentication-app",
            }
        };

    } catch(error)
    {
        console.log(error);
        throw error;
    } finally {
        client.destroy();
    }
}