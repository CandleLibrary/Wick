import { datum as local_datum, test } from "@parent";

local_datum = "Test";

export default <div component="child"> Parent data: ((local_datum)) </div>;

export { local_datum };