import {APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent} from "aws-lambda";
import {CognitoJwtVerifier} from "aws-jwt-verify";
import crypto from "crypto";
import {EnvUtil} from "./env.util";
import {CognitoIdentityProviderClient, InternalErrorException} from "@aws-sdk/client-cognito-identity-provider";

const AWS_ACCOUNT = process.env.AUTH_AWS_ACCOUNT_ID;
const AWS_REGION = process.env.AUTH_AWS_REGION;

export class KcUtil {

    static ALLOW_TEXT = "Allow";
    static DENY_TEXT = "Deny";
    static PRINCIPAL_ID = "user|kcatucuamba";

    static async validateToken(token: string): Promise<string> {

        const userPoolId = process.env.AUTH_USER_POOL_ID;
        const clientId = process.env.AUTH_CLIENT_ID;

        const verifier = CognitoJwtVerifier.create({
            userPoolId,
            tokenUse: "access",
            clientId
        });

        token = token.replace("Bearer ", "");

        try {
            const response = await verifier.verify(token as any);
            console.log("Validate token: " + JSON.stringify(response));
            return response.username;
        } catch (e) {
            console.log("Error to validate token: " + e);
            console.log(e);
            return null;
        }

    }

    static async generatePolicy(event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> {

        const username = await KcUtil.validateToken(event.authorizationToken);

        if (username == null) {
            return await KcUtil.createPolicy("user|null", KcUtil.DENY_TEXT, event.methodArn);
        }

        const resource = "arn:aws:execute-api:" + AWS_REGION + ":" + AWS_ACCOUNT + ":*/*/*/*";
        return await KcUtil.createPolicy(`user|${username}`, KcUtil.ALLOW_TEXT, resource);
    }


    static async generateSecretHash(login: string) {
        const [clientId, secretClient] = EnvUtil.getObjectEnvVarOrThrow(['AUTH_CLIENT_ID', 'AUTH_SECRET_CLIENT']);
        return crypto.createHmac('sha256', secretClient)
            .update(`${login}${clientId}`).digest('base64');
    }

    static async createCognitoClient(){
        const [region] = EnvUtil.getObjectEnvVarOrThrow(['AUTH_AWS_REGION']);
        return new CognitoIdentityProviderClient({region});
    }

    static async createPolicy(
        principalId: string,
        effect: string,
        resource: string): Promise<APIGatewayAuthorizerResult> {
        return {
            principalId: principalId,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: effect,
                        Resource: [resource]
                    }
                ]

            },
            context: {
                key: 'value',
                number: 1,
                bool: true
            }
        };

    }
}