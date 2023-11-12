import {
    SignUpCommand,
    SignUpCommandInput as Input,
    SignUpCommandOutput as Output
} from "@aws-sdk/client-cognito-identity-provider";
import {AuthSignUpRq, AuthSignUpRs} from "../models/auth-login.model";
import {loggerUtil as log} from "../utils/logger.util";
import {HttpStatusCode} from "axios";
import {CognitoUtil} from "../utils/cognito.util";
import {CommandUtil} from "../utils/command.util";

export const SignupCommandExecutor = async (request: AuthSignUpRq): Promise<AuthSignUpRs> => {
    log.info("Sign up command executor: " + JSON.stringify(request));
    const signUpCommandInput = await CommandUtil.mapSignUpCommandInput(request);
    const command = new SignUpCommand(signUpCommandInput);
    const response = await CognitoUtil.executeCommand<Input, Output>(command)

    if (response.status != 0) {
        log.info("Error to signup (command)");
        throw new Error(CommandUtil.getMessageHttpLambda(HttpStatusCode.InternalServerError, response.errors[0]));
    }

    const authSignUpRs: AuthSignUpRs = {
        authSignUpResult: {
            username: request.authentication.login,
            message: `User ${request.authentication.login} created successfully.`,
            nextChallenge: '/auth/confirm-user'
        }
    }

    log.info("AuthSignUpRs: " + JSON.stringify(authSignUpRs));
    return authSignUpRs;
}