import {AdminSetUserPasswordRq} from "../models/auth-login.model";
import {loggerUtil as log} from "../utils/logger.util";
import {AdminSetUserPasswordCommand, CognitoIdentityProviderClient} from "@aws-sdk/client-cognito-identity-provider";
import {HttpStatusCode} from "axios";
import {EnvUtil} from "../utils/env.util";
import {KcUtil} from "../utils/kc.util";

export const changePwdFirstTimeCommandExecutor = async (adminSetUserPwdRq: AdminSetUserPasswordRq) => {

    const {username, password} = adminSetUserPwdRq;

    const [region, userPoolId] = EnvUtil.getObjectEnvVarOrThrow(['AUTH_AWS_REGION', 'AUTH_USER_POOL_ID']);

    log.info('username: ' + username);
    log.info('region: ' + region);
    log.info('userPoolId: ' + userPoolId);

    const cognitoClient = await KcUtil.createCognitoClient();

    const command = new AdminSetUserPasswordCommand({
        Password: password,
        Permanent: true,
        UserPoolId: userPoolId,
        Username: username
    });


    try {
        const response = await cognitoClient.send(command);
        log.info("Response AdminSetUserPasswordCommand: " + JSON.stringify(response));
        return response.$metadata.httpStatusCode ?? HttpStatusCode.InternalServerError;
    } catch (e) {
        log.error("Error to change password: " + e);
        log.error(e);
        log.info("Error to change password (catch): " + JSON.stringify(e));
        throw new Error(HttpStatusCode.InternalServerError.toString());
    } finally {
        cognitoClient.destroy();
    }

}