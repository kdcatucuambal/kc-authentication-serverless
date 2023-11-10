import {EnvUtil} from "../utils/env.util";
import {CognitoIdentityProviderClient, InitiateAuthCommand} from "@aws-sdk/client-cognito-identity-provider";
import {AuthLoginRs, AuthUserCredentials} from "../models/auth-login.model";
import {loggerUtil as log} from "../utils/logger.util";
import crypto from "crypto";
import {HttpStatusCode} from "axios";
import {KcUtil} from "../utils/kc.util";

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

    const cognitoClient = await KcUtil.createCognitoClient();

    try {
        const response = await cognitoClient.send(command);
        log.info("Initiate auth command response: " + JSON.stringify(response));
        if (!response.AuthenticationResult && response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
            log.info("Authentication failed: Code 401")
            return {
                statusMessage: "It is necessary to change the password",
                credentials: null
            }
        }
        return {
            statusMessage: "Authentication successful",
            credentials: {
                idToken: response.AuthenticationResult.IdToken,
                accessToken: response.AuthenticationResult.AccessToken,
                refreshToken: response.AuthenticationResult.RefreshToken
            },
            session: response.Session
        }


    } catch (error) {
        log.info("Error to authenticate (catch): " + error);
        log.info("Error to authenticate (catch): " + JSON.stringify(error));
        console.log("Console log:" + error);
        const errorResponse = {
            status: 500,
            body: "Hay muchos errores",
            headers: {
                "Content-Type": "application/json",
            }
        }
        throw new Error(HttpStatusCode.InternalServerError.toString());
    } finally {
        cognitoClient.destroy();
    }


}