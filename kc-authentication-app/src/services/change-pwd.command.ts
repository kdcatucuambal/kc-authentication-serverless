import {
    RespondToAuthChallengeCommand,
    RespondToAuthChallengeCommandInput as Input,
    RespondToAuthChallengeCommandOutput as Output
} from "@aws-sdk/client-cognito-identity-provider";
import {loggerUtil as log} from "../utils/logger.util";
import {EnvUtil} from "../utils/env.util";
import {AuthChangePasswordRq, AuthChangePasswordRs} from "../models/auth-login.model";
import {HttpStatusCode} from "axios";
import {KcUtil} from "../utils/kc.util";
import {CognitoUtil} from "../utils/cognito.util";

export const changePwdFirstTimeCommandExecutor = async (input: AuthChangePasswordRq): Promise<AuthChangePasswordRs> => {
    log.info("changePwdFirstTimeV2CommandExecutor input: " + JSON.stringify(input));
    const {authenticationResult: {password, session, login}} = input;
    const [clientId] = EnvUtil.getObjectEnvVarOrThrow(['AUTH_CLIENT_ID']);
    const hash = await KcUtil.generateSecretHash(login);
    const command = new RespondToAuthChallengeCommand({
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ClientId: clientId,
        ChallengeResponses: {
            USERNAME: login,
            NEW_PASSWORD: password,
            SECRET_HASH: hash
        },
        Session: session
    });
    const {status} = await CognitoUtil.executeCommand<Input, Output>(command);
    if (status != 0) {
        log.info("Error to change password (command): ");
        throw new Error(HttpStatusCode.InternalServerError.toString());
    }

    const authChangePasswordRs: AuthChangePasswordRs = {
        changePasswordResult: {
            message: "Password changed successfully",
            nextChallenge: "/auth/login"
        }
    }
    log.info("AuthChangePasswordRs: " + JSON.stringify(authChangePasswordRs));
    return authChangePasswordRs;

}