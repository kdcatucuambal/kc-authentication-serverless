import {EnvUtil} from "../utils/env.util";
import {
    InitiateAuthCommand,
    InitiateAuthCommandInput as Input,
    InitiateAuthCommandOutput as Output
} from "@aws-sdk/client-cognito-identity-provider";
import {AuthLoginRq, AuthLoginRs} from "../models/auth-login.model";
import {loggerUtil as log} from "../utils/logger.util";
import {HttpStatusCode} from "axios";
import {KcUtil} from "../utils/kc.util";
import {CognitoUtil} from "../utils/cognito.util";
import {logger} from "../spikes/logger.spike";

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
    const response = await CognitoUtil.executeCommand<Input, Output>(command);
    if (response.status != 0) {
        throw new Error(HttpStatusCode.InternalServerError.toString());
    }
    if (!response.result.AuthenticationResult && response.result.ChallengeName === "NEW_PASSWORD_REQUIRED") {
        log.info("Authentication failed: Code 401")
        return {
            statusMessage: "It is necessary to change the password",
            credentials: null
        }
    }
    return {
        statusMessage: "Authentication successful",
        credentials: {
            idToken: response.result.AuthenticationResult.IdToken,
            accessToken: response.result.AuthenticationResult.AccessToken,
            refreshToken: response.result.AuthenticationResult.RefreshToken
        },
        session: response.result.Session
    }
}