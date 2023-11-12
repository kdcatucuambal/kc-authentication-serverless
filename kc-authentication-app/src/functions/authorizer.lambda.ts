import {APIGatewayTokenAuthorizerHandler} from "aws-lambda";
import {loggerUtil} from "../utils/logger.util";
import {KcUtil} from "../utils/kc.util";
import {LambdaUtil} from "../utils/lambda.util";


export const handlerAuthorizer: APIGatewayTokenAuthorizerHandler = async (event, context) => {
    loggerUtil.info("Function invoke: handlerAuthorizer");
    LambdaUtil.logContext(event, context);
    return await KcUtil.generatePolicy(event);
}