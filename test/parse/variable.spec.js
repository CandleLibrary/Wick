/**
 * Parsing arrow functions should take into 
 * account the arrow's argument expressions,
 * which should not be registered as binding
 * variables, and the presence of these 
 * references within the body or expression
 * of the arrow expression node
 */

import URI from "@candlelib/uri";
import { parseSource } from "../../build/library/compiler/ast-parse/source.js";
import Presets from "../../build/library/compiler/common/presets.js";
import { BINDING_VARIABLE_TYPE } from "../../build/library/types/binding.js";

assert_group("Arrow arguments should not be appear as binding variables", sequence, () => {
    const source = `<div>{ data.push((a,b,c)=>a+b+c) }</div>`;

    const presets = new Presets();

    const component_data = await parseSource(source, presets, URI.getCWDURL());

    assert("'data' should be the only binding variable", component_data.root_frame.binding_variables.size == 1);

});

assert_group("Function arguments should not be appear as binding variables", sequence, () => {
    const source = `
        
        function test(a,b,c){ return a+b+c };

        export default <div>{ data.map(test) }</div>
    `;

    const presets = new Presets();

    const component_data = await parseSource(source, presets, URI.getCWDURL());

    assert("'data' and `test` should be the only binding variables", component_data.root_frame.binding_variables.size == 2);
    assert("'data' should be an undeclared binding variable type", component_data.root_frame.binding_variables.get("data").type == BINDING_VARIABLE_TYPE.UNDECLARED);
    assert("'test' should be a method binding variable type", component_data.root_frame.binding_variables.get("test").type == BINDING_VARIABLE_TYPE.METHOD_VARIABLE);

});


assert_group("Variables not declared in function should be binding", sequence, () => {
    const source = `
        const d = 0;
        
        function test(a,b,c){ return a+b+c+d };

        export default <div>{ data.map(test) }</div>
    `;

    const presets = new Presets();

    const component_data = await parseSource(source, presets, URI.getCWDURL());

    assert("'data' and `test` and `d` should be the only binding variables", component_data.root_frame.binding_variables.size == 3);
    assert("'d' should be a const binding variable type", component_data.root_frame.binding_variables.get("d").type == BINDING_VARIABLE_TYPE.CONST_INTERNAL_VARIABLE);

});