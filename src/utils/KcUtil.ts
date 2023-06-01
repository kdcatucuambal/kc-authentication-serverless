import {APIGatewayAuthorizerResult} from "aws-lambda";
import {PolicyPayload} from "../models/PolicyPayload";


export class KcUtil {

    static ALLOW_TEXT = "Allow";
    static DENY_TEXT = "Deny";
    static PRINCIPAL_ID = "user|kcatucuamba";

    static async validateToken(token: string): Promise<boolean> {
        //TODO: Implement token validation
        return token === 'Bearer xyzyouarevalid';
    }

    static async generatePolicy(payload: PolicyPayload): Promise<APIGatewayAuthorizerResult> {
        return {
            principalId: payload.principalId,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: payload.effect,
                        Resource: [payload.resource]
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