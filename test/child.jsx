import { update } from "@parent";

var out = 0;

export default <div component="child">
    <h1 onclick="((out += 2))" > T ((name)) T</h1 >
    Test component dev((update))
</div>;

export { out };