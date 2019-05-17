import { ScriptNode } from "./script.mjs";
import { Template } from "../template/template_bindings";
import { SCRIPT, DYNAMICbindingID } from "../template/basic_bindings";



export class ScopedNode extends ScriptNode {
    processAttributeHook(name, lex, func) {
        switch (name) {
            case "on":
                let binding = Template(lex, false);
                if (binding.type == DYNAMICbindingID) {
                    binding.method = SCRIPT;
                    this.binding = this.processTapBinding(binding);
                    this.binding.HAVE_CLOSURE = true;
                    this.binding._func_ = func;
                }
                return null;
        }

        return { name, value: lex.slice() };
    }

    toString(){ return  "" };
}
