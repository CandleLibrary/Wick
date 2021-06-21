import Presets from "../../build/library/compiler/common/presets.js";
import { componentDataToTempAST } from "../../build/library/compiler/ast-build/html.js";
import { parseSource } from "../../build/library/compiler/ast-parse/source.js";
import { assertTree } from "../test-tools/tools.js";
import { htmlTemplateToString } from "../../build/library/compiler/ast-render/html.js";

const source_string = `
const todo_list = [
    { completed:false, priority:4, task: "A"},
    { completed:true, priority:3, task: "B"},
    { completed:false, priority:2, task: "C"},
    { completed:true, priority:1, task: "D"}
    
    ]
    
    export default <div>
        <container data=\${todo_list} filter=\${m.completed == false} sort=\${m2.priority - m1.priority}>
            <li> \${task} </li>
        </container>
        <container data=\${todo_list} filter=\${m => m.completed == true} sort=\${(m1, m2) => m2.priority - m1.priority}>
            <li> \${task} </li>
        </container>
    </div>
 `;
assert_group("Expect containers to have filtered and ordered elements", sequence, () => {
    const presets = new Presets;

    const component = await parseSource(source_string, presets);

    const { html } = await componentDataToTempAST(component, presets);

    const html_string = htmlTemplateToString(html[0]);

    assertTree({
        c: [{
            t: "div",
            c: [
                { c: [{ c: [{ d: 'C' }] }] },
                { c: [{ c: [{ d: 'A' }] }] }
            ]
        }, {
            t: "div",
            c: [
                { c: [{ c: [{ d: 'D' }] }] },
                { c: [{ c: [{ d: 'B' }] }] }
            ]
        }]
    }, html[0]);
});