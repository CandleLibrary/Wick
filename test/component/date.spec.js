import Presets from "../../build/library/compiler/common/presets.js";
import { componentDataToTempAST } from "../../build/library/compiler/ast-build/html.js";
import { parseSource } from "../../build/library/compiler/ast-parse/source.js";
import { assertTree } from "../test-tools/tools.js";

const source_string = `
 var date = (new Date(0)).getUTCFullYear();
 
 export default <div>\${date}</div>
 `;
assert_group("Expect Date object to be rendered in pre-filled HTML", sequence, () => {
    const presets = new Presets;

    const component = await parseSource(source_string, presets);

    const { html } = await componentDataToTempAST(component, presets);

    assertTree({
        t: "",
        c: [{
            t: "w-b",
            c: [
                {
                    d: "1970"
                },
            ]
        }]
    }, html[0]);
});