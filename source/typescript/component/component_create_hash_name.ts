import { b } from "@candlefw/wind/build/types/ascii_code_points";

let seed_tracker = 0xf012501;

function PseudoRandom(seed = 0x1f25d8e2f98) {
    return (seed ^ (seed_tracker ^= seed_tracker + 1) % 1256581324) / 1256581324;
}

function shuffle(array, round = 0, max_rounds = 4, depth = 0, max_depth = 5 | 0) {
    if (depth < max_depth) {

        const divider = (PseudoRandom() * 2 - 1 * array.length * 0.75 + array.length) | 0;

        const array_shuffled = [
            ...shuffle(array.slice(divider).reverse(), 0, max_rounds, depth + 1, max_depth),
            ...shuffle(array.slice(0, divider).reverse(), 0, max_rounds, depth + 1, max_depth)
        ];

        if (round < max_rounds)
            return shuffle(array_shuffled, round + 1, max_rounds, depth, max_depth);

        return array_shuffled;
    }

    return array;
}

const P_Table = shuffle(new Array(256).fill(0).map((j, i) => i));

function PearsonModifiedHash(string: string) {

    const max_v = 16;
    const byte_size = max_v << 3;
    const str_l = string.length;
    const hh = new Uint8Array(max_v);

    let i;
    let j;

    for (j = 0; j < max_v; j++)
        hh[j] = P_Table[(string.charCodeAt(0) + j) % 256];

    for (i = 1; i < str_l; ++i) {
        const v = string.charCodeAt(i);
        for (j = 0; j < max_v; ++j)
            hh[j] = P_Table[hh[j] ^ v];
    }

    return (
        "000000000000000000000"
        + [...hh]
            .map((v, i) => BigInt(v) << BigInt(byte_size - 8 - (i << 3)))
            .reduce((r, v) => BigInt(v) | r, BigInt(0))
            .toString(36)
            .toUpperCase()
    ).slice(-13);
}

/**
 * Create a hash name to uniquely identify a component.
 * @param string - source file contents.
*/
export const createNameHash = (string: string) => "W" + PearsonModifiedHash(string);
