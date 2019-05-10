import { VoidNode } from "./void";
import { Template } from "../template/template_bindings";
import { SCRIPT, DYNAMICbindingID } from "../template/basic_bindings";
import JSTools from "../../../js/tools.mjs";

export class ScriptNode extends VoidNode {
    constructor() {
        super();
        this.script_text = "";
        this.binding = null;
    }

    processTextNodeHook(lex) {
        
        this.script_text = lex.slice();
        
    
        const {ids, ast} = JSTools.getRootVariables(lex);

        console.log(ast)
        let tvrs = ast.traverseDepthFirst();
        let node = tvrs.next().value
        while(node !== undefined){
            switch 
            node = tvrs.next().value
        }
        
        if (this.binding){
            this.binding.ids = [...ids.values()];
            this.binding.val = this.script_text;
        }
    }

    processAttributeHook(name, lex) {
        switch (name) {
            case "on":
                let binding = Template(lex, false);
                if (binding.type == DYNAMICbindingID) {
                    binding.method = SCRIPT;
                    this.binding = this.processTapBinding(binding);
                }
                return null;
        }
        return super.processAttributeHook(name, lex);
    }

    build(element, scope, presets, errors, taps, statics = {}, RENDER_ALL = false) {
        if(RENDER_ALL)
            return super.build(element, scope, presets, errors, taps, statics, RENDER_ALL);
        
        if(this.url){
            statics = Object.assign({}, statics);
            statics.url = this.url
        }
        
        if (this.binding)
            this.binding._bind_(scope, errors, taps, element, "", this, statics);        
    }
}
