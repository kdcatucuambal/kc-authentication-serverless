import {CognitoIdentityProviderClient, RespondToAuthChallengeCommand} from "@aws-sdk/client-cognito-identity-provider";
import {loggerUtil as log} from "../utils/logger.util";
import {EnvUtil} from "../utils/env.util";
import {AuthChangePasswordV2Rq} from "../models/auth-login.model";
import {HttpStatusCode} from "axios";
import crypto from "crypto";
import {KcUtil} from "../utils/kc.util";

export const changePwdFirstTimeV2CommandExecutor = async (input: AuthChangePasswordV2Rq) => {

    const {authentication, session, newPassword} = input;


    const [region, userPoolId, clientId] = EnvUtil.getObjectEnvVarOrThrow([
        'AUTH_AWS_REGION', 'AUTH_USER_POOL_ID', 'AUTH_CLIENT_ID']);

    log.info('username: ' + authentication.login);

    log.info('clientId: ' + clientId);
    log.info('region: ' + region);
    log.info('userPoolId: ' + userPoolId);

    const client = new CognitoIdentityProviderClient({region});

    const hash = await KcUtil.generateSecretHash(authentication.login);
    log.info("Hash: " + hash)

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

    try {
        const response = await client.send(command);
        log.info("RespondToAuthChallengeCommand: " + JSON.stringify(response));
        return response.$metadata.httpStatusCode ?? HttpStatusCode.InternalServerError;
    } catch (e) {
        log.error("Error to change password: " + e);
        log.error(e);
        throw new Error(HttpStatusCode.InternalServerError.toString());
    } finally {
        client.destroy();
    }


}