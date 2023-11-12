import {APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent} from "aws-lambda";
import {CognitoJwtVerifier} from "aws-jwt-verify";
import crypto from "crypto";
import {EnvUtil} from "./env.util";
import {CognitoIdentityProviderClient, InternalErrorException} from "@aws-sdk/client-cognito-identity-provider";
import {loggerUtil as logger} from "./logger.util";
import {HttpStatusCode} from "axios";

const AWS_ACCOUNT = process.env.AUTH_AWS_ACCOUNT_ID;
const AWS_REGION = process.env.AUTH_AWS_REGION;

export class KcUtil {

    static ALLOW_TEXT = "Allow";
    static DENY_TEXT = "Deny";

    static async validateToken(token: string): Promise<string> {
        const userPoolId = process.env.AUTH_USER_POOL_ID;
        const clientId = process.env.AUTH_CLIENT_ID;
        const verifier = CognitoJwtVerifier.create({userPoolId, tokenUse: "access", clientId});
        token = token.replace("Bearer ", "");
        try {
            const response = await verifier.verify(token as any);
            logger.info("Validate token: " + JSON.stringify(response));
            return response.username;
        } catch (e) {
            logger.info("Error to validate token: " + JSON.stringify(e));
            throw new Error(HttpStatusCode.Unauthorized.toString());
        }
    }

    static async generatePolicy(event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> {
        const username = await KcUtil.validateToken(event.authorizationToken);
        const resource = username == null ?
            event.methodArn : `arn:aws:execute-api:${AWS_REGION}:${AWS_ACCOUNT}:*/*/*/*`;
        const effect = username == null ? KcUtil.DENY_TEXT : KcUtil.ALLOW_TEXT;
        const policyGenerated = await KcUtil.createPolicy(`user|${username || "null"}`, effect, resource);
        logger.info("Policy generated: " + JSON.stringify(policyGenerated));
        return policyGenerated;
    }


    static async generateSecretHash(login: string) {
        const [clientId, secretClient] = EnvUtil.getObjectEnvVarOrThrow(
            ['AUTH_CLIENT_ID', 'AUTH_SECRET_CLIENT']);
        const hash = crypto.createHmac('sha256', secretClient)
            .update(`${login}${clientId}`).digest('base64');
        logger.info("Hash: " + hash);
        return hash;
    }

    static async createCognitoClient() {
        const [region] = EnvUtil.getObjectEnvVarOrThrow(['AUTH_AWS_REGION']);
        logger.info("CognitoIdentityProviderClient created: " + region)
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