import {KcRequestProxyEvent} from "../models/handler.model";
import {AdminSetUserPasswordRequest, AdminSetUserPasswordResponse} from "../models/auth-login.model";
import {changePwdFirstTimeCommandExecutor} from "../services/change-pwd-ftime.command";
import {HttpStatusCode} from "axios";
import {loggerUtil as log} from "../utils/logger.util";

export const handlerChangePassword: KcRequestProxyEvent<
    AdminSetUserPasswordRequest,
    AdminSetUserPasswordResponse> = async (event, context) => {

    log.info('Event: ' + JSON.stringify(event));
    log.info('Context: ' + JSON.stringify(context));

    const httpCodeCmd = await changePwdFirstTimeCommandExecutor(event.body);

    return {
        body: {
            statusHttpCommand: httpCodeCmd,
            message: "Password changed successfully"
        },
        statusCode: HttpStatusCode.Created,
        headers: {}
    }

}