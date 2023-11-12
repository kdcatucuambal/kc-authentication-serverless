import {KcUtil} from "./kc.util";
import {$Command} from "@aws-sdk/client-cognito-identity-provider";
import {logger} from "../spikes/logger.spike";


export interface OutputCommand<T> {

    status: number;
    result: T
    errors: string[];

}

export class CognitoUtil {

    static async executeCommand<I, O>(command: $Command<any, any, any>): Promise<OutputCommand<O>> {
        logger.info("Executing command: " + JSON.stringify(command));
        const client = await KcUtil.createCognitoClient();
        const result: OutputCommand<O> = {} as OutputCommand<O>;
        try {
            result.status = 0;
            result.errors = [];
            result.result = await client.send(command);
        } catch (e) {
            console.log(JSON.stringify(e));
            logger.info("Error to execute command: " + JSON.stringify(e));
            result.status = 1;
            result.errors = [e.message];
            result.result = null;
        } finally {
            client.destroy();
        }
        logger.info("Execute command result: " + JSON.stringify(result));
        return result;
    }

}