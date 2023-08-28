import {KcRequestProxyEvent} from "../models/Handler";
import {AuthChangePassword} from "../models/AuthLogin";
import {CognitoIdentityProviderClient, ChangePasswordCommand} from "@aws-sdk/client-cognito-identity-provider";

export const ChangePassword: KcRequestProxyEvent<AuthChangePassword, string> = async (event, context)=>{
    console.log('Event: ' + JSON.stringify(event));
    console.log('Context: ' + JSON.stringify(context));
const {previousPassword, proposedPassword, token} =  event.body;
    console.log('previos password: ' + previousPassword);
    console.log('proposed password: ' + proposedPassword);
    console.log('token: ' + token);

    const region = process.env.AUTH_AWS_REGION;

    const client = new CognitoIdentityProviderClient({region});

    const command = new ChangePasswordCommand({
        AccessToken: token,
        PreviousPassword: previousPassword,
        ProposedPassword: proposedPassword
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