import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    SignUpCommandInput
} from "@aws-sdk/client-cognito-identity-provider";
import {SignUpRq, SignUpRs} from "../models/auth-login.model";
import {KcUtil} from "../utils/kc.util";
import {loggerUtil as log} from "../utils/logger.util";
import {EnvUtil} from "../utils/env.util";
import {HttpStatusCode} from "axios";
export const SignupCommandExecutor = async (request: SignUpRq): Promise<SignUpRs> => {

    const { username, password, attributes } = request;

    const hash = await KcUtil.generateSecretHash(username);
    log.info("Hash: " + hash)

    const [clientId, region] = EnvUtil.getObjectEnvVarOrThrow(['AUTH_CLIENT_ID', 'AUTH_AWS_REGION']);

    const client = new CognitoIdentityProviderClient({region});

    const signUpCommandInput: SignUpCommandInput = {
        ClientId: clientId,
        Password: password,
        Username: username,
        SecretHash: hash,
        UserAttributes: [
            {
                Name: "email",
                Value: attributes.email
            },
            {
                Name: "name",
                Value: attributes.name + " " + attributes.lastName
            },
            {
                Name: "phone_number",
                Value: attributes.phoneNumber
            }
        ]
    }

    const command = new SignUpCommand(signUpCommandInput);

    try {
        const response = await client.send(command);
        log.info("RespondToAuthChallengeCommand: " + JSON.stringify(response));
        return {
            username: username,
            message: `User ${username} created successfully.`
        }
    } catch (e) {
        log.error("Error to change password: " + e);
        log.error(e);
        throw new Error(HttpStatusCode.InternalServerError.toString());
    } finally {
        client.destroy();
    }

}