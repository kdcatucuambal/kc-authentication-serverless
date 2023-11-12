import {EnvUtil} from "../utils/env.util";
import {
    InitiateAuthCommand,
    InitiateAuthCommandInput as Input,
    InitiateAuthCommandOutput as Output
} from "@aws-sdk/client-cognito-identity-provider";
import {AuthLoginRq, AuthLoginRs} from "../models/auth-login.model";
import {loggerUtil as logger} from "../utils/logger.util";
import {HttpStatusCode} from "axios";
import {KcUtil} from "../utils/kc.util";
import {CognitoUtil} from "../utils/cognito.util";
import {CommandUtil} from "../utils/command.util";

export const LogInCommandExecutor = async (authLoginRq: AuthLoginRq): Promise<AuthLoginRs> => {
    logger.info("Log in command executor: " + JSON.stringify(authLoginRq));
    const [clientId] = EnvUtil.getObjectEnvVarOrThrow(['AUTH_CLIENT_ID']);
    const {authentication: {login, password}} = authLoginRq;
    const hash = await KcUtil.generateSecretHash(login);
    const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: {
            USERNAME: login,
            PASSWORD: password,
            SECRET_HASH: hash
        }
    });
    const commandRs = await CognitoUtil.executeCommand<Input, Output>(command);
    if (commandRs.status != 0) {
        throw new Error(HttpStatusCode.InternalServerError.toString());
    }
    const authLoginRs: AuthLoginRs = CommandUtil.mapResultCommandToAuthLoginRs(commandRs);
    logger.info("AuthLoginRs: " + JSON.stringify(authLoginRs));
    return authLoginRs;
}