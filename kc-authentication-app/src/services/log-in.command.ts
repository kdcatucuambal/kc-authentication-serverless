import {EnvUtil} from "../utils/env.util";
import {
    InitiateAuthCommand,
    InitiateAuthCommandInput as Input,
    InitiateAuthCommandOutput as Output
} from "@aws-sdk/client-cognito-identity-provider";
import {AuthLoginRs, AuthUserCredentials} from "../models/auth-login.model";
import {loggerUtil as log} from "../utils/logger.util";
import crypto from "crypto";
import {HttpStatusCode} from "axios";
import {KcUtil} from "../utils/kc.util";
import {CognitoUtil} from "../utils/cognito.util";

export const LogInCommandExecutor = async (authUserCredentials: AuthUserCredentials): Promise<AuthLoginRs> => {

    const [clientId] = EnvUtil.getObjectEnvVarOrThrow(['AUTH_CLIENT_ID']);

    const {username, password} = authUserCredentials;

    log.info("username: " + username);
    log.info("password: " + password);

    const hash = await KcUtil.generateSecretHash(username);
    log.info("Hash: " + hash)

    const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
            SECRET_HASH: hash
        }
    });

    const response = await CognitoUtil.executeCommand<Input, Output>(command);
    log.info("Initiate auth command response: " + JSON.stringify(response));

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