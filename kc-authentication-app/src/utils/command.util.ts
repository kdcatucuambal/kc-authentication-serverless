import {InitiateAuthCommandOutput, SignUpCommandInput} from "@aws-sdk/client-cognito-identity-provider";
import {AuthChangePasswordRs, AuthLoginRs, AuthSignUpRq} from "../models/auth-login.model";
import {OutputCommand} from "./cognito.util";
import {loggerUtil as log} from "./logger.util";
import {EnvUtil} from "./env.util";
import {KcUtil} from "./kc.util";

export class CommandUtil {

    private static CHALLENGE_NAME_CHANGE_PASSWORD = "/auth/change-password";
    private static CHALLENGE_NAME_LOGIN = "/auth/login";


    static getMessageHttpLambda(statusHttp: number, cause: string){
        return `${statusHttp}:${cause}`;
    }
    static mapResultCommandToAuthLoginRs({
                                             result,
                                             status,
                                             errors
                                         }: OutputCommand<InitiateAuthCommandOutput>): AuthLoginRs {


        if (!result.AuthenticationResult && result.ChallengeName === "NEW_PASSWORD_REQUIRED") {
            log.info("Authentication failed: Code 401")
            return {
                authenticationResult: {
                    message: "It is necessary to change the password",
                    session: result.Session,
                    nextChallenge: CommandUtil.CHALLENGE_NAME_CHANGE_PASSWORD
                }
            }
        }
        return {
            authenticationResult: {
                message: "Authentication successful",
                credentials: {
                    accessToken: result.AuthenticationResult?.AccessToken,
                },
                nextChallenge: CommandUtil.CHALLENGE_NAME_LOGIN
            }
        }
    }




    static async mapSignUpCommandInput({authentication, attributes}: AuthSignUpRq): Promise<SignUpCommandInput>{
        const clientId = EnvUtil.getAuthClientId();
        const hash = await KcUtil.generateSecretHash(authentication.username);
        return {
            ClientId: clientId,
            Password: authentication.password,
            Username: authentication.username,
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
    }

}