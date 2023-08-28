import {KcRequestProxyEvent} from "../models/Handler";
import {AuthChangePassword} from "../models/AuthLogin";
import {CognitoIdentityProviderClient, AdminSetUserPasswordCommand, AdminSetUserPasswordRequest} from "@aws-sdk/client-cognito-identity-provider";

export const handlerChangePassword: KcRequestProxyEvent<AdminSetUserPasswordRequest, string> = async (event, context)=>{
    console.log('Event: ' + JSON.stringify(event));
    console.log('Context: ' + JSON.stringify(context));
    const {Password, Permanent, UserPoolId,Username} =  event.body;


    const region = process.env.AUTH_AWS_REGION;



    const client = new CognitoIdentityProviderClient({region});

    const command = new AdminSetUserPasswordCommand({
        Password,
        Permanent,
        UserPoolId,
        Username
    })



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