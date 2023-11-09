import {handlerAuthorizer} from "./functions/authorizer.lambda";
import {handlerLogIn} from "./functions/log-in.lambda";
import {handlerTestIn} from "./functions/test-in.lambda";
import {handlerChangePassword} from "./functions/change-password-ftime.lambda";
import {handlerChangePasswordV2} from "./functions/change-pwd-ftime-v2.lambda";
import {handlerSignUp} from "./functions/singup.lambda";

export {
    handlerAuthorizer,
    handlerLogIn,
    handlerTestIn,
    handlerChangePassword,
    handlerChangePasswordV2,
    handlerSignUp
};