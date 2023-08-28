import {RequestObject, ResponseObject} from "./RequestObject";
import {Context} from "aws-lambda";

export type KcRequestProxyEvent<T, R> = (
    event: RequestObject<T>,
    context: Context) => Promise<ResponseObject<R>>
