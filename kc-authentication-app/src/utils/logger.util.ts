import {createLogger, format, transports} from "winston";

export const loggerUtil = createLogger({
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