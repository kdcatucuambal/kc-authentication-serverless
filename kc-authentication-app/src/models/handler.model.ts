import {RequestObject, ResponseObject} from "./object.model";
import {Context} from "aws-lambda";

export type KcRequestProxyEvent<T, R> = (event: RequestObject<T>, context: Context) => Promise<ResponseObject<R>>
