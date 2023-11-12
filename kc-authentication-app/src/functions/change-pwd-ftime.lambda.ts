import {KcRequestProxyEvent} from "../models/handler.model";
import {
    AdminSetUserPasswordRs,
    AuthChangePasswordRq, AuthChangePasswordRs
} from "../models/auth-login.model";

import {HttpStatusCode} from "axios";
import {changePwdFirstTimeCommandExecutor} from "../services/change-pwd.command";
import {LambdaUtil} from "../utils/lambda.util";

export const handlerChangePassword:
    KcRequestProxyEvent<AuthChangePasswordRq, AuthChangePasswordRs> = async (event, context) => {
    LambdaUtil.logContext(event, context);
    const changePasswordRs = await changePwdFirstTimeCommandExecutor(event.body);
    const headers = {
        "service_method: ": "handler_change_password_v2"
    }

    return LambdaUtil.mappingResponse(changePasswordRs, HttpStatusCode.Created, headers)
}