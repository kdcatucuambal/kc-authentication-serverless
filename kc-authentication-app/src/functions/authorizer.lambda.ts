import {APIGatewayTokenAuthorizerHandler} from "aws-lambda";
import {loggerUtil} from "../utils/logger.util";
import {KcUtil} from "../utils/kc.util";


export const handlerAuthorizer: APIGatewayTokenAuthorizerHandler = async (event, context) => {

    loggerUtil.info("Function invoke: handlerAuthorizer");
    loggerUtil.info('Event: ' + JSON.stringify(event));
    loggerUtil.info('Context: ' + JSON.stringify(context));

    const policy = await KcUtil.generatePolicy(event);

    loggerUtil.info('Policy generated: ' + JSON.stringify(policy));

    return policy;

}