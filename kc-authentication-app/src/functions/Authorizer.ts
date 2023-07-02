import {APIGatewayTokenAuthorizerHandler} from "aws-lambda";
import {logger} from "../utils/Logger";
import {KcUtil} from "../utils/KcUtil";


export const handlerAuthorizer: APIGatewayTokenAuthorizerHandler = async (event, context) => {
    logger.info("Function invoke: handlerAuthorizer");
    logger.info('Event: ' + JSON.stringify(event));
    logger.info('Context: ' + JSON.stringify(context));
    const policy = await KcUtil.generatePolicy(event);
    logger.info('Policy generated: ' + JSON.stringify(policy));
    return policy;


}