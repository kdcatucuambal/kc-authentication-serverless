import {CustomError} from "../exceptions/custom.error";
import {logger} from "./logger.spike";




const execute = async (code: number) => {

    if (code <= 100) {
        throw new CustomError("Wrong Code input user", {
            code: code,
            message: "Not implemented yet",
            metadata: {
                httpCode: 400,
                timestamp: new Date(),
                error: "Bad Request"
            }
        });
    }

    return "OK"

}

const main = async () => {

    try {
        const result = await execute(10);
        console.log("Result: " + result);
    } catch (e) {
        console.log(typeof e);
        console.log("Some: ", e.message);
        logger.info("Some: " + e.message);
        console.log(JSON.stringify(e))
    }


}

main().then();