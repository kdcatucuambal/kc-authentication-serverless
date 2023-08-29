import {EnvUtil} from "../utils/env.util";
import {CognitoIdentityProviderClient, InitiateAuthCommand} from "@aws-sdk/client-cognito-identity-provider";
import {AuthLoginResponse, AuthUserCredentials} from "../models/auth-login.model";
import {loggerUtil as log} from "../utils/logger.util";
import crypto from "crypto";
import {HttpStatusCode} from "axios";
import {CustomError} from "../exceptions/custom.error";

export const LogInCommandExecutor = async (authUserCredentials: AuthUserCredentials): Promise<AuthLoginResponse> => {

    const [region, clientId, secretClient] = EnvUtil.getObjectEnvVarOrThrow(
        ['AUTH_AWS_REGION', 'AUTH_CLIENT_ID', 'AUTH_SECRET_CLIENT']);

    const {username, password} = authUserCredentials;

    const client = new CognitoIdentityProviderClient({region});

    log.info("username: " + username);
    log.info("password: " + password);

    const hash = crypto.createHmac('sha256', secretClient).update(`${username}${clientId}`).digest('base64');

    const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
            SECRET_HASH: hash
        }
    });

    try {
        const response = await client.send(command);
        log.info("RESPONSE = " + JSON.stringify(response));
        if (response.$metadata.httpStatusCode !== 200 && response.$metadata.httpStatusCode !== 201) {
            log.info("Authentication failed: Code 500")
            throw new Error(response.$metadata.httpStatusCode.toString());
        }

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
            }
        }


    } catch (error) {
        log.info("Error to authenticate (catch): " + error);
        throw new CustomError(HttpStatusCode.InternalServerError.toString(), error);
    } finally {
        client.destroy();
    }


}