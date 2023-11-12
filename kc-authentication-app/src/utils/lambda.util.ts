import {RequestObject, ResponseObject} from "../models/object.model";
import {Context} from "aws-lambda";

export class LambdaUtil {


    static logContext(event: any, context: Context) {
        console.log('Event (Request): ' + JSON.stringify(event));
        console.log('Context: ' + JSON.stringify(context));
    }

    static mappingResponse<R>(body: R, statusCode: number, headers: Record<string, string>): ResponseObject<R> {
        return {body, headers, statusCode}
    }
}