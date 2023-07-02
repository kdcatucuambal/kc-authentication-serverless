import {RequestObject, ResponseObject} from "./RequestObject";
import {AuthUserCredentials, AuthLoginResponse} from "./AuthLogin";
import {Context} from "aws-lambda";

export type KcRequestProxyEvent = (
    event: RequestObject<AuthUserCredentials>,
    context: Context) => Promise<ResponseObject<AuthLoginResponse>>
