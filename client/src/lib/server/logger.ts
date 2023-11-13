import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.json()
    ),
    defaultMeta: { service: 'dash' },
    transports: [
        new transports.Console(),
    ]
});