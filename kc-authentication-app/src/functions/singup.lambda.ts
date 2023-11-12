import {KcRequestProxyEvent} from "../models/handler.model";
import {SignUpRq, SignUpRs} from "../models/auth-login.model";

import {HttpStatusCode} from "axios";
import {SignupCommandExecutor} from "../services/signup.command";
import {LambdaUtil} from "../utils/lambda.util";


export const handlerSignUp: KcRequestProxyEvent<SignUpRq, SignUpRs> = async (event, context) => {
    LambdaUtil.logContext(event, context);
    const authLoginResponse = await SignupCommandExecutor(event.body);
    const headers = {
        "service_method: ": "handler_sign_up"
    }
    return LambdaUtil.mappingResponse(authLoginResponse, HttpStatusCode.Created, headers)
}

