import {KcRequestProxyEvent} from "../models/handler.model";
import {
    AdminSetUserPasswordRs,
    AuthChangePasswordV2Rq
} from "../models/auth-login.model";
import {loggerUtil as log} from "../utils/logger.util";

import {HttpStatusCode} from "axios";
import {changePwdFirstTimeV2CommandExecutor} from "../services/change-pwd-v2.command";

export const handlerChangePasswordV2:
    KcRequestProxyEvent<AuthChangePasswordV2Rq, AdminSetUserPasswordRs> = async (event, context) => {

    log.info('Event: ' + JSON.stringify(event));
    log.info('Context: ' + JSON.stringify(context));

    const httpCodeCmd = await changePwdFirstTimeV2CommandExecutor(event.body)

    return {
        body: {
            statusHttpCommand: httpCodeCmd,
            message: "Password changed successfully"
        },
        statusCode: HttpStatusCode.Created,
        headers: {}
    }

}