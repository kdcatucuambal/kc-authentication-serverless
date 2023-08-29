import {RequestObjectModel, ResponseObject} from "./request-object.model";
import {Context} from "aws-lambda";

export type KcRequestProxyEvent<T, R> = (event: RequestObjectModel<T>, context: Context) => Promise<ResponseObject<R>>
