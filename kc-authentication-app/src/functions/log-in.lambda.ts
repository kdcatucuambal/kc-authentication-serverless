import {KcRequestProxyEvent} from "../models/handler.model";
import {AuthLoginRq, AuthLoginRs} from "../models/auth-login.model";
import {LogInCommandExecutor} from "../services/log-in.command";
import {HttpStatusCode} from "axios";
import {LambdaUtil} from "../utils/lambda.util";


export const handlerLogIn: KcRequestProxyEvent<AuthLoginRq, AuthLoginRs> = async (event, context) => {
    LambdaUtil.logContext(event, context);
    const authLoginResponse = await LogInCommandExecutor(event.body);
    const headers = {
        "service_method: ": "handler_log_in"
    }
    return LambdaUtil.mappingResponse(authLoginResponse, HttpStatusCode.Created, headers)

}

