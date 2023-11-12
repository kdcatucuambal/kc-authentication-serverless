import {createLogger, format, transports} from "winston";

export const logger = createLogger({
    level: 'info',
    transports: [
        new transports.Console({
            format: format.combine(
                format.printf(info => {
                    const now = new Date();
                    //const messageToJSON = JSON.stringify(info.message);
                    const messageToJSON = info.message;
                    return `${now.toLocaleString()} [${info.level.toUpperCase()}] ${messageToJSON}`;
                })
            )
        })
    ]
});

const json = {
    name: "John",
    age: 31,
    city: "New York"
}

console.log(json);
logger.info('Hello world=> ' + JSON.stringify(json));
logger.info("", "")