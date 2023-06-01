
import { createLogger, format, transports } from 'winston';



const logger = createLogger({
    level: 'info',
    transports: [
        new transports.Console({
            format: format.combine(
                format.printf(info => {
                    return `${info.level}: ${info.message}`;
                })
            )
        })
    ]
});

const payload = {
    principalId: 'user|kcatucuamba',
    resource: 'arn:aws:execute-api:us-east-1:123456789012:ymy8tbxw7b/*/GET/',
    effect: 'Allow',
    context: {
        key: 'value',
        number: 1,
        bool: true
    },
    policyDocument: {
        Version: '2012-10-17',
    }
}

console.log('Payload Generated: ' + JSON.stringify(payload));
logger.info("Msg: " + JSON.stringify(payload));