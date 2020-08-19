import * as log4js from 'log4js';

export enum RequestType {
    ACK = 0,
    transmit = 1,
}

export interface Request {
    status: number;
    type?: RequestType;
    data?: string;
}

export interface Register {
    port: number;
    host: string;
    certificate?: string;
    channel: string;
}

log4js.configure({
    appenders: { cheese: { type: "file", filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});

export const logger = log4js.getLogger("cheese");

logger.level = 'info';


