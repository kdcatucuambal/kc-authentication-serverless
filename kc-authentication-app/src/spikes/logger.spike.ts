import {createLogger, format, transports} from "winston";

export const logger = createLogger({
    level: 'info',
    transports: [
        new transports.Console({
            format: format.combine(
                format.printf(info => {
                    const now = new Date();
                    const messageToJSON = JSON.stringify(info.message);
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

logger.info('Hello world=> ' + json);