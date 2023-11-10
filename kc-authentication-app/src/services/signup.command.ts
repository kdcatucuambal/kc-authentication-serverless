import {
    SignUpCommand,
    SignUpCommandInput as Input,
    SignUpCommandOutput as Output
} from "@aws-sdk/client-cognito-identity-provider";
import {SignUpRq, SignUpRs} from "../models/auth-login.model";
import {KcUtil} from "../utils/kc.util";
import {loggerUtil as log} from "../utils/logger.util";
import {EnvUtil} from "../utils/env.util";
import {HttpStatusCode} from "axios";
import {CognitoUtil} from "../utils/cognito.util";

export const SignupCommandExecutor = async (request: SignUpRq): Promise<SignUpRs> => {

    const {username, password, attributes} = request;

    const hash = await KcUtil.generateSecretHash(username);
    log.info("Hash: " + hash)

    const [clientId] = EnvUtil.getObjectEnvVarOrThrow(['AUTH_CLIENT_ID', 'AUTH_AWS_REGION']);

    const signUpCommandInput: Input = {
        ClientId: clientId,
        Password: password,
        Username: username,
        SecretHash: hash,
        UserAttributes: [
            {
                Name: "email", Value: attributes.email
            },
            {
                Name: "name", Value: attributes.name
            },
            {
                Name: "family_name", Value: attributes.lastName
            },
            {
                Name: "phone_number", Value: attributes.phoneNumber
            },
            {
                Name: "updated_at", Value: Math.floor(Date.now() / 1000).toString()
            }
        ]
    }


    const command = new SignUpCommand(signUpCommandInput);
    const response = await CognitoUtil.executeCommand<Input, Output>(command)

    if (response.status != 0) {
        log.info("Error to signup (command): ");
        throw new Error(HttpStatusCode.InternalServerError.toString());
    }

    return {
        username: username,
        message: `User ${username} created successfully.`
    }
    
}