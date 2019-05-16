import { VoidNode } from "./void";
import { Template } from "../template/template_bindings";
import { SCRIPT, DYNAMICbindingID } from "../template/basic_bindings";
import types from "../../../js/types.mjs";
import identifier from "../../../js/nodes/identifier.mjs";
import member from "../../../js/nodes/member.mjs";
import JSTools from "../../../js/tools.mjs";
import glow from "@candlefw/glow";

const defaults = {
    glow
}

export class ScriptNode extends VoidNode {
    constructor() {
        super();
        this.script_text = "";
        this.binding = null;
    }

    processTextNodeHook(lex) {

        this.script_text = lex.slice();

        try {
            const ast = JSTools.parse(lex);

            let
                tvrs = ast.traverseDepthFirst(),
                node = tvrs.next().value,
                non_global = new Set(),
                globals = new Set(),
                assignments = new Map();

            //Retrieve undeclared variables to inject as function arguments.
            while (node) {

                if (
                    node.type == types.id ||
                    node.type == types.member
                ) {
                    if (node.root)
                        globals.add(node.name);
                }

                if (node.type == types.assign) {

                    node.id.root = false;

                    if (!assignments.has(node.id.name))
                        assignments.set(node.id.name, []);

                    const assignment_sites = assignments.get(node.id.name);

                    assignment_sites.push(node);
                }

                if (
                    node.type == types.lex ||
                    node.type == types.var
                ) {
                    node.bindings.forEach(b => (non_global.add(b.id.name), globals.delete(b.id.name)))
                }

                node = tvrs.next().value
            }

            //Process any out globals and get argument wrappers
            const out_globals = [...globals.values()].reduce((red, out) => {
                let out_object = { name: out, val: null, IS_TAPPED: false };

                if (window[out]){
                    return red;
                    //out_object.val = window[out];
                }

                else if (this.presets.custom[out])
                    out_object.val = this.presets.custom[out];

                else if (this.presets[out])
                    out_object.val = this.presets[out];

                else if (defaults[out])
                    out_object.val = defaults[out]

                else {
                    out_object.IS_TAPPED = true;
                }

                red.push(out_object)

                return red;
            },[])

            //Replace matching call sites with emit functions / emit member nodes
            assignments.forEach((m,k)=>m.forEach(assign => {
                if (window[k] || this.presets.custom[k]|| this.presets[k]|| defaults[k])
                    return;
                assign.id = new member([new identifier(["emit"]), null, assign.id]);
            }))

            console.log(ast.render())

            /* TODO: replace TAPPED assignments with emit(name, value) expressions. */

            if (this.binding) {
                this.binding.args = out_globals;
                this.binding.val = ast.render();
            }

        } catch (e) {
            console.error(e)
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
        if (RENDER_ALL)
            return super.build(element, scope, presets, errors, taps, statics, RENDER_ALL);

        if (this.url) {
            statics = Object.assign({}, statics);
            statics.url = this.url
        }

        if (this.binding)
            this.binding._bind_(scope, errors, taps, element, "", this, statics);
    }
}