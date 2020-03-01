import { types, identifier, call_expression, string, parenthasized } from "@candlefw/js";

import glow from "source/typescript/old/stamp/stamp/lite/node_modules/@candlefw/glow";

import JS from "./tools.js.js.js.js.js";

const defaults = {
    glow,
    wickNodeExpression: function(scope, id) {
        const out = scope.ast.presets.components[id].mount(null, scope, scope.ast.presets, undefined, undefined, true);
        return out;
    }
};

const root = typeof(global) == "object" ? global : window;

export function copyAST(ast){
    for(const node of parse(ast.render()).traverseDepthFirst()){
        if(node.type == ast.type)
            return node;
    }
}

export function * getTypeInClosure(ast, ...types){
    for(const node of ast.traverseDepthFirst()){
        if(
            node.type == types.function_declaration ||
            node.type == types.class_declaration ||
            node.type == types.object_literal
        ) {
            node.skip();
        }

        if(types.includes(node.type))
            yield node;
    }
}

/* Returns true if await is found within the givin ast's closure. Will not enter closures of function, class, or object definitions */
export function AsyncInClosure(ast){
    for(const node of ast.traverseDepthFirst()){
        if(
            node.type == types.function_declaration ||
            node.type == types.class_declaration ||
            node.type == types.object_literal
        ) {
            node.skip();
        }

        if(node.type == types.await_expression){
            return true;
        }
    }
}

export function GetOutGlobals(ast, presets) {
    const args = [];
    const ids = [];
    const arg_lu = new Set();

    JS.getClosureVariableNames(ast).forEach(out => {

        const name = out.name;
        if (out.parent &&
            out.type == types.identifier &&
            out.parent.type == types.assignment_expression &&
            out == out.parent.left
        ) {
            // Expression name = expr would overwrite any value that "name" referenced, so there's no 
            // reason to count it among the global values.
        } else if (!arg_lu.has(name)) {
            arg_lu.add(name);

            const out_object = { name, val: null, IS_TAPPED: false, IS_ELEMENT: false };

            if (presets.custom[name])
                out_object.val = presets.custom[name];
            else if (presets[name])
                out_object.val = presets[name];
            else if (defaults[name]) {
                out_object.val = defaults[name];
            } else if (root[name]) {
                out_object.val = root[name];
            } else if (name[name.length - 1] == "$") {
                out_object.IS_ELEMENT = true;
            } else {
                out_object.IS_TAPPED = true;
            }
            args.push(out_object);
        }
        ids.push(out);
    });

    return { args, ids };
}

export function AddEmit(ast, presets, ignore) {


    ast.forEach(node => {


        if (
            node.parent &&
            node.parent.type == types.assignment_expression &&
            node.type == types.identifier
        ) {
            if (node == node.parent.left) {

                const k = node.name;

                if ((root[k] && !(root[k] instanceof HTMLElement)) || presets.custom[k] || presets[k] || defaults[k] || ignore.includes(k))
                    return;
                
                node.parent.replace(new call_expression(
                    [
                        new identifier(["emit"]),
                        new parenthasized(new string([null, node.name, null]), node.parent.right),
                    ]
                ));
            }
            return;
        }
        if (
            node.type == types.member_expression &&
            node.mem.name == "emit" &&
            node.parent.type == types.call_expression
        ) {
//*
            const k = node.parent.name;

            if ((root[k] && !(root[k] instanceof HTMLElement)) || presets.custom[k] || presets[k] || defaults[k] || ignore.includes(k))
                return;
            //*
            const args = [new string([null, node.name, null])];

            if(node.parent.args)
                args.push(...node.parent.args.vals);

            node.parent.replace(
                new call_expression(
                    [
                        new identifier(["emit"]),
                        new parenthasized(...args)
                    ]
                )
            );

            return;
            //*/
        }
    });
}
