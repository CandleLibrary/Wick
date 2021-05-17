import { Binding_Variable_Has_Static_Default_Value } from "../../build/library/common/binding.js";
import { createComponentData } from "../../build/library/common/component.js";
import { createFrame } from "../../build/library/common/frame.js";
import Presets from "../../build/library/common/presets.js";
import { processCoreAsync } from "../../build/library/component/parse/parser.js";
import parserSourceString from "../../build/library/source_code/parse.js";

const source_string = `

var A = 2;
const B = 3;
let C = 4;
let E = B;

function F(){
    E = A + B + C;
}

export default <div>\${E + D}</div> `;

const { ast } = parserSourceString(source_string);

const presets = new Presets();

assert("Sanity Parse", ast != null);

const component = createComponentData(source_string);

component.root_frame = createFrame(null, component);

assert_group("Function frame and bindings", () => {

    assert(component.root_frame.IS_ROOT == true);

    const
        root_frame = await processCoreAsync(ast, component.root_frame, component, presets),
        A = root_frame.binding_variables.get("A"),
        B = root_frame.binding_variables.get("B"),
        C = root_frame.binding_variables.get("C"),
        D = root_frame.binding_variables.get("D"),
        E = root_frame.binding_variables.get("E"),
        F = root_frame.binding_variables.get("F");

    assert(root_frame.binding_variables.size == 6);

    assert(A.type == 1);
    assert(B.type == 64);
    assert(C.type == 1);
    assert(D.type == 0);
    assert(E.type == 1);
    assert(F.type == 2);

    assert(A.ref_count == 1);
    assert(B.ref_count == 2);
    assert(C.ref_count == 1);
    assert(D.ref_count == 1);
    assert(E.ref_count == 2);
    assert(F.ref_count == 0);

    assert(Binding_Variable_Has_Static_Default_Value(A, component) == true);
    assert(Binding_Variable_Has_Static_Default_Value(B, component) == true);
    assert(Binding_Variable_Has_Static_Default_Value(C, component) == true);
    assert(Binding_Variable_Has_Static_Default_Value(D, component) == false);
    assert(Binding_Variable_Has_Static_Default_Value(E, component) == true);
    assert(Binding_Variable_Has_Static_Default_Value(F, component) == false);
});