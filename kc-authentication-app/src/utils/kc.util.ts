import {APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent} from "aws-lambda";
import {CognitoJwtVerifier} from "aws-jwt-verify";

const AWS_ACCOUNT = process.env.AUTH_AWS_ACCOUNT_ID;
const AWS_REGION = process.env.AUTH_AWS_REGION;

export class KcUtil {

    static ALLOW_TEXT = "Allow";
    static DENY_TEXT = "Deny";
    static PRINCIPAL_ID = "user|kcatucuamba";

    static async validateToken(token: string): Promise<boolean> {
        
        const userPoolId = process.env.AUTH_USER_POOL_ID;
        const clientId = process.env.AUTH_CLIENT_ID;
    
        const verifier = CognitoJwtVerifier.create({
            userPoolId,
            tokenUse: "access",
            clientId
        });

        console.log("Token original: " + token);
        token = token.replace("Bearer ", "");
        console.log("Token to send: " + token);
        try {
            const response = await verifier.verify(token);
            console.log("Validate token: " + JSON.stringify(response));
            return true;
        }catch (e) {
            console.log("Error to validate token: " + e);
            console.log(e);
            return false;
        }

    }

    static async generatePolicy(event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> {

        const isTokenFailed = !(await KcUtil.validateToken(event.authorizationToken));

        if (isTokenFailed) {
            return await KcUtil.createPolicy("user/unauthorized", KcUtil.DENY_TEXT, event.methodArn);
        }

        const resource = "arn:aws:execute-api:" + AWS_REGION + ":" + AWS_ACCOUNT + ":*/*/*/*";
        return await KcUtil.createPolicy(KcUtil.PRINCIPAL_ID, KcUtil.ALLOW_TEXT, resource);
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