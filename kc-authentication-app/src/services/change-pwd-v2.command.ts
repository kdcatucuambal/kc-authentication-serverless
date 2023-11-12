import {
    RespondToAuthChallengeCommand,
    RespondToAuthChallengeCommandInput as Input,
    RespondToAuthChallengeCommandOutput as Output
} from "@aws-sdk/client-cognito-identity-provider";
import {loggerUtil as log} from "../utils/logger.util";
import {EnvUtil} from "../utils/env.util";
import {AuthChangePasswordV2Rq} from "../models/auth-login.model";
import {HttpStatusCode} from "axios";
import {KcUtil} from "../utils/kc.util";
import {CognitoUtil} from "../utils/cognito.util";

export const changePwdFirstTimeV2CommandExecutor = async (input: AuthChangePasswordV2Rq) => {
    log.info("changePwdFirstTimeV2CommandExecutor input: " + JSON.stringify(input));
    const {authentication, session, newPassword} = input;
    const [clientId] = EnvUtil.getObjectEnvVarOrThrow(['AUTH_CLIENT_ID']);
    const hash = await KcUtil.generateSecretHash(authentication.login);
    const command = new RespondToAuthChallengeCommand({
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ClientId: clientId,
        ChallengeResponses: {
            USERNAME: authentication.login,
            NEW_PASSWORD: newPassword,
            SECRET_HASH: hash
        },
        Session: session
    });

    const response = await CognitoUtil.executeCommand<Input, Output>(command);
    if (response.status != 0){
        log.info("Error to change password v2 (command): ");
        throw new Error(HttpStatusCode.InternalServerError.toString());
    }
    return response.result.$metadata.httpStatusCode ?? HttpStatusCode.InternalServerError;
}