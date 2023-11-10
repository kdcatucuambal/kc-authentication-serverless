import {
    CognitoIdentityProviderClient,
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

    const {authentication, session, newPassword} = input;


    const [region, userPoolId, clientId] = EnvUtil.getObjectEnvVarOrThrow([
        'AUTH_AWS_REGION', 'AUTH_USER_POOL_ID', 'AUTH_CLIENT_ID']);

    log.info('username: ' + authentication.login);

    log.info('clientId: ' + clientId);
    log.info('region: ' + region);
    log.info('userPoolId: ' + userPoolId);

    const cognitoClient = await KcUtil.createCognitoClient();

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

    const response = await CognitoUtil.executeCommand<Input, Output>(command);
    
    if (response.status != 0){
        log.info("Error to change password v2 (command): ");
        throw new Error(HttpStatusCode.InternalServerError.toString());
    }

    return response.result.$metadata.httpStatusCode ?? HttpStatusCode.InternalServerError;


}