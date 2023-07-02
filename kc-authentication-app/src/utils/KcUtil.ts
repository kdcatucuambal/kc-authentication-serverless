import {APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent} from "aws-lambda";


const AWS_ACCOUNT = process.env.AUTH_AWS_ACCOUNT_ID;
const AWS_REGION = process.env.AUTH_AWS_REGION;

export class KcUtil {

    static ALLOW_TEXT = "Allow";
    static DENY_TEXT = "Deny";
    static PRINCIPAL_ID = "user|kcatucuamba";

    static async validateToken(token: string): Promise<boolean> {
        //TODO: Implement token validation
        return token === 'Bearer xyzuio';
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