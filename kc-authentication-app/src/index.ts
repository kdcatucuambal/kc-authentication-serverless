import {handlerAuthorizer} from "./functions/authorizer.lambda";
import {handlerLogIn} from "./functions/log-in.lambda";
import {handlerTestIn} from "./functions/test-in.lambda";
import {handlerChangePassword} from "./functions/change-password-ftime.lambda";

export {
    handlerAuthorizer,
    handlerLogIn,
    handlerTestIn,
    handlerChangePassword
};