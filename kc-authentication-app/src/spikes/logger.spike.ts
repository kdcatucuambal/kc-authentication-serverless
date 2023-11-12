import {createLogger, format, transports} from "winston";

export const loggerSpk = createLogger({
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
loggerSpk.info('Hello world=> ' + JSON.stringify(json));
loggerSpk.info("", "")