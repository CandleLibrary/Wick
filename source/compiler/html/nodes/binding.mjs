export const EXPRESSION = 5;
export const IDENTIFIER = 6;
export const CONTAINER = 7;
export const BOOL = 8;

import types from "../../js/types.mjs";
import identifier from "../../js/nodes/identifier.mjs";
import assignement from "../../js/nodes/assign.mjs";
import member from "../../js/nodes/member.mjs";
import rtrn from "../../js/nodes/return.mjs";
//import JSTools from "../../js/tools.mjs";

import ExpressionIO  from "../../component/io/expression_io.mjs";
import ContainerIO  from "../../component/io/container_io.mjs";

import glow from "@candlefw/glow";

const defaults = { glow }


export default class Binding{
	
	constructor(sym, env, lex){
		this.lex = lex.copy(); 
		this.lex.sl = lex.off-3; 
		this.lex.off = env.start; 

		this.METHOD = IDENTIFIER;
		
		this.expr = sym[1];
        this.exprb = (sym.length > 3) ? sym[3] : null;

		this.args = null;
		this.val = this.expr + "";

		if(!(this.expr instanceof identifier) && !(this.expr instanceof member))
			this.processJSAST(this.expr, env.presets);

		console.log(this.expr + "")
	}

    toString(){
        if(this.exprb)
            return `((${this.expr + ""})(${this.exprb + ""}))`;
        else
            return `((${this.expr + ""}))`;
    }

	processJSAST(ast, presets = {custom:{}}, ALLOW_EMIT = false){

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

            else if (presets.custom[out])
                out_object.val = presets.custom[out];

            else if (presets[out])
                out_object.val = presets[out];

            else if (defaults[out])
                out_object.val = defaults[out]

            else {
                out_object.IS_TAPPED = true;
            }

            red.push(out_object)

            return red;
        },[])

        if(ALLOW_EMIT)
		    //Replace matching call sites with emit functions / emit member nodes
		    assignments.forEach((m,k)=>m.forEach(assign => {
		        if (window[k] || this.presets.custom[k]|| this.presets[k]|| defaults[k])
		            return;
		        assign.id = new member([new identifier(["emit"]), null, assign.id]);
		    }))

        
        let r = new rtrn([]);
        r.expr = ast;
        ast = r;

        this.args = out_globals;
        this.val = ast + "";
        this.expr = ast;
        this.METHOD = EXPRESSION;
	}

    setForContainer(){
        if(this.METHOD == EXPRESSION)
            this.METHOD = CONTAINER;
    }

	bind(scope, element){
        if(this.METHOD == EXPRESSION){
            return new ExpressionIO(element, scope, [], scope, this, this.lex);
        }else if(this.METHOD == CONTAINER)
            return new ContainerIO(element, scope, [], scope, this, this.lex);
        else 
            return scope.getTap(this.val);	
    }
}

Binding.type = {
	Attribute:0,
	TextNode:1,
	Style:2
}