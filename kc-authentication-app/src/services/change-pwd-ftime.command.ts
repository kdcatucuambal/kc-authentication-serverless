import {AdminSetUserPasswordRq} from "../models/auth-login.model";
import {loggerUtil as log} from "../utils/logger.util";
import {
    AdminSetUserPasswordCommand,
    AdminSetUserPasswordCommandInput as Input,
    AdminSetUserPasswordCommandOutput as Output
} from "@aws-sdk/client-cognito-identity-provider";
import {HttpStatusCode} from "axios";
import {EnvUtil} from "../utils/env.util";
import {CognitoUtil} from "../utils/cognito.util";

export const changePwdFirstTimeCommandExecutor = async (adminSetUserPwdRq: AdminSetUserPasswordRq) => {

    const {username, password} = adminSetUserPwdRq;

    const [region, userPoolId] = EnvUtil.getObjectEnvVarOrThrow(['AUTH_AWS_REGION', 'AUTH_USER_POOL_ID']);

    log.info('username: ' + username);
    log.info('region: ' + region);
    log.info('userPoolId: ' + userPoolId);


    const command = new AdminSetUserPasswordCommand({
        Password: password,
        Permanent: true,
        UserPoolId: userPoolId,
        Username: username
    });

    const out = await CognitoUtil.executeCommand<Input, Output>(command);
    log.info("Response AdminSetUserPasswordCommand: " + JSON.stringify(out));

    if (out.status != 0) {
        log.info("Error to change password (command): ");
        throw new Error(HttpStatusCode.InternalServerError.toString());
    }

    return out.result.$metadata.httpStatusCode ?? HttpStatusCode.InternalServerError;
}