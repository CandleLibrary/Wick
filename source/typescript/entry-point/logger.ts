export function log(...args) {
    console.log(...args);
}

export function dir(args) {
    console.dir(args, {
        breakLength: 75,
        depth: null,
        maxArrayLength: Infinity,
        maxStringLength: Infinity,
    });
}

export function error(e: Error) {
    console.log(error);
}

export function trace(...args) {
    console.trace(args[0]);
}