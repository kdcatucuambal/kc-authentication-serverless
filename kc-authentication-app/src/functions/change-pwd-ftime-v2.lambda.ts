import {KcRequestProxyEvent} from "../models/handler.model";
import {
    AdminSetUserPasswordRs,
    AuthChangePasswordV2Rq
} from "../models/auth-login.model";
import {loggerUtil as log} from "../utils/logger.util";

import {HttpStatusCode} from "axios";
import {changePwdFirstTimeV2CommandExecutor} from "../services/change-pwd-v2.command";
import {LambdaUtil} from "../utils/lambda.util";

export const handlerChangePasswordV2:
    KcRequestProxyEvent<AuthChangePasswordV2Rq, AdminSetUserPasswordRs> = async (event, context) => {
    LambdaUtil.logContext(event, context);
    const httpCodeCmd = await changePwdFirstTimeV2CommandExecutor(event.body);
    const headers = {
        "service_method: ": "handler_change_password_v2"
    }
    const body: AdminSetUserPasswordRs = {message: "Password changed successfully", statusHttpCommand: httpCodeCmd}
    return LambdaUtil.mappingResponse(body, HttpStatusCode.Created, headers)
}