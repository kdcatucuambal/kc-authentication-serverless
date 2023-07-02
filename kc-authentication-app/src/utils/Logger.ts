import {createLogger, format, transports} from "winston";

export const logger = createLogger({
    level: 'info',
    transports: [
        new transports.Console({
            format: format.combine(
                format.printf(info => {
                    const now = new Date();
                    return `${now.toISOString()} [${info.level.toUpperCase()}] ${info.message}`;
                })
            )
        })
    ]
});