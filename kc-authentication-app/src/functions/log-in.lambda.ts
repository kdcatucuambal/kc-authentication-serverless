

import {KcRequestProxyEvent} from "../models/handler.model";
import {AuthLoginResponse, AuthUserCredentials} from "../models/auth-login.model";
import {LogInCommandExecutor} from "../services/log-in.command";


export const handlerLogIn: KcRequestProxyEvent<AuthUserCredentials, AuthLoginResponse> = async(event, context) => {
    console.log('Event: ' + JSON.stringify(event));
    console.log('Context: ' + JSON.stringify(context));
    const authLoginResponse = await LogInCommandExecutor(event.body);
    return {
        body: authLoginResponse,
        statusCode: 201,
        headers:{}
    }
}

