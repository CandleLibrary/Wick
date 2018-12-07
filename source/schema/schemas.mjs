import { OB } from "../short_names";

import { SchemeConstructor } from "./constructor";

import { date, DateSchemeConstructor } from "./types/date";

import { time, TimeSchemeConstructor } from "./types/time";

import { string, StringSchemeConstructor } from "./types/string";

import { number, NumberSchemeConstructor } from "./types/number";

import { bool, BoolSchemeConstructor } from "./types/bool";

let schemes = { date, string, number, bool, time };


/**
 * Used by Models to ensure conformance to a predefined data structure. Becomes immutable once created.
 * @param {Object} data - An Object of `key`:`value` pairs used to define the Scheme. `value`s must be instances of or SchemeConstructor or classes that extend SchemeConstructor.
 * @readonly
 */
class Schema {}

export { SchemeConstructor, DateSchemeConstructor, TimeSchemeConstructor, StringSchemeConstructor, NumberSchemeConstructor, BoolSchemeConstructor, schemes };