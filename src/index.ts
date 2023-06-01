import { APIGatewayTokenAuthorizerHandler } from "aws-lambda";
import { createLogger, format, transports } from 'winston';
import { KcUtil } from "./utils/KcUtil";
import { PolicyPayload } from "./models/PolicyPayload";



const logger = createLogger({
    level: 'info',
    transports: [
        new transports.Console({
            format: format.combine(
                format.printf(info => {
                    return `${info.level}: ${info.message}`;
                })
            )
        })
    ]
});

export const handler: APIGatewayTokenAuthorizerHandler = async (event, context) => {
    logger.info('Event: ' + JSON.stringify(event));
    logger.info('Context: ' + JSON.stringify(context));
    const token = event.authorizationToken;
    logger.info('Token: ' + token);
    const payload: PolicyPayload = {
        principalId: KcUtil.PRINCIPAL_ID,
        resource: event.methodArn,
        effect: "Allow"
    };

    const isTokenFailed = !(await KcUtil.validateToken(token));

    if (isTokenFailed) {
        logger.info('Token is invalid');
        payload.effect = 'Deny';
    }

    const policy = await KcUtil.generatePolicy(payload);
    logger.info('Policy generated: ' + JSON.stringify(policy));
    logger.info(JSON.stringify(policy));
    //console.log('Policy (Log): ' + JSON.stringify(policy));
    return policy;
}