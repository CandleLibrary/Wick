import { SchemaConstructor } from "./constructor"

import { date, DateSchemaConstructor } from "./types/date"

import { time, TimeSchemaConstructor } from "./types/time"

import { string, StringSchemaConstructor } from "./types/string"

import { number, NumberSchemaConstructor } from "./types/number"

import { bool, BoolSchemaConstructor } from "./types/bool"

let schema = { date, string, number, bool, time }

export { SchemaConstructor, DateSchemaConstructor, TimeSchemaConstructor, StringSchemaConstructor, NumberSchemaConstructor, BoolSchemaConstructor, schema };