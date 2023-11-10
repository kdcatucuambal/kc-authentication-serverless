import {KcUtil} from "./kc.util";
import {$Command} from "@aws-sdk/client-cognito-identity-provider";


export interface Output<T> {

    status: number;
    result: T
    errors: string[];

}

export class CognitoUtil {

    static async executeCommand<I, O>(command: $Command<any, any, any>): Promise<Output<O>> {
        const client = await KcUtil.createCognitoClient();
        const result: Output<O> = {} as Output<O>;

        try {
            result.status = 0;
            result.errors = [];
            result.result = await client.send(command);
        } catch (e) {
            console.log("Error to execute command: " + e);
            result.status = 1;
            result.errors = ["Error", "E2"]
            result.result = null;
        } finally {
            client.destroy();
        }

        return result;
    }

}