/**
 * Parsing arrow functions should take into 
 * account the arrow's argument expressions,
 * which should not be registered as binding
 * variables, and the presence of these 
 * references within the body or expression
 * of the arrow expression node
 */

import { renderCompressed } from "@candlelib/js";
import { createCompiledComponentClass, runClassHookHandlers } from "../../build/library/compiler/ast-build/build.js";
import { componentDataToTempAST } from "../../build/library/compiler/ast-build/html.js";
import { htmlTemplateToString } from "../../build/library/compiler/ast-ender/html.js";
import { parseSource } from "../../build/library/compiler/ast-parse/source.js";
import { createClassStringObject } from "../../build/library/compiler/ast-render/js.js";
import Presets from "../../build/library/compiler/common/presets.js";


const source = `
var a = 2;
var b = 3;

export default <div>
    <container data=\${ data.push((a,b,c)=>a+b+c) }> </container>
    <container data=\${ data.push((a,c)=>a+b+c) }> </container>
</div>
`;
const presets = new Presets();

const component = await parseSource(source, presets);
const comp_info = await createCompiledComponentClass(component, presets);
const class_string = createClassStringObject(component, comp_info, presets);
const template = await componentDataToTempAST(component, presets);
const html = htmlTemplateToString(template.html[0]);

assert(component.root_frame.binding_variables.has("a") == true);
assert(component.root_frame.binding_variables.has("b") == true);
assert(component.root_frame.binding_variables.has("c") == false);
assert(component.root_frame.binding_variables.has("x") == false);
assert(component.root_frame.binding_variables.has("y") == false);
assert(component.root_frame.binding_variables.has("data") == true);


const { hook: hook1 } = runClassHookHandlers(component.hooks[0], component, presets, comp_info);
const { hook: hook2 } = runClassHookHandlers(component.hooks[1], component, presets, comp_info);

assert(renderCompressed(hook1.write_ast) == "this.ct[0].sd(data.push((a,b,c)=>a+b+c));");
assert(renderCompressed(hook2.write_ast) == "this.ct[1].sd(data.push((a,c)=>a+b+c));");
//assert(html == "")
