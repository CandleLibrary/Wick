import { Logger } from "@candlelib/log";

const wick_logger = Logger.createLogger("wick");

export function warn(...args) {
    wick_logger.warn(...args);
}
export function log(...args) {
    wick_logger.log(...args);
}

export function dir(args) {
    wick_logger.log(args);
}

export function error(e: Error) {
    wick_logger.log(error);
}

export function trace(...args) {
    console.trace(args[0]);
}