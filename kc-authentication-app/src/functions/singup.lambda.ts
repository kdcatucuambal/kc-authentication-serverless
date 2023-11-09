import {KcRequestProxyEvent} from "../models/handler.model";
import {SignUpRq, SignUpRs} from "../models/auth-login.model";

import {HttpStatusCode} from "axios";
import {SignupCommandExecutor} from "../services/signup.command";


export const handlerSignUp: KcRequestProxyEvent<SignUpRq, SignUpRs> = async (event, context) => {
    console.log('Event: ' + JSON.stringify(event));
    console.log('Context: ' + JSON.stringify(context));
    const authLoginResponse = await SignupCommandExecutor(event.body);
    return {
        body: authLoginResponse,
        statusCode: HttpStatusCode.Created,
        headers: {}
    }
}

