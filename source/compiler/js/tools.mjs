import { types, identifier } from "@candlefw/js";
const env = {};
export default {

    processType(type, ast, fn) {
        for (const a of ast.traverseDepthFirst()) {
            if (a.type == type)
                fn(a);
        }
    },

    getFirst(ast, type) {
        const tvrs = ast.traverseDepthFirst();
        let node = null;

        while ((node = tvrs.next().value)) {
            if (node.type == type) {
                return node;
            }
        }

        return null;
    },

    getClosureVariableNames(ast, ...global_objects) {
        if (!ast)
            return;
        const
            tvrs = ast.traverseDepthFirst(),
            non_global = new Set(global_objects),
            globals = new Set();
        let
            node = tvrs.next().value;

        //Retrieve undeclared variables to inject as function arguments.
        while (node) {
            if (
                node.type == types.identifier ||
                node.type == types.member_expression
            ) {
                if (node.type == types.member_expression && !(
                        node.id.type == types.identifier ||
                        node.id.type == types.member_expression
                    )) {} else
                if (node.root && !non_global.has(node.name)) {
                    globals.add(node);
                } else {
                    //non_global.add(node.name);
                }
            }

            if (ast !== node && node.type == types.arrow_function_declaration) {

                const glbl = new Set;
                const closure = new Set;

                node.getRootIds(glbl, closure);

                const g = this.getClosureVariableNames(node, ...[...closure.values(), ...non_global.values()]);

                g.forEach(v => {
                    if (Array.isArray(v)) debugger;
                    globals.add(v);
                });

                node.skip();
            }

            if (
                node.type == types.lexical_declaration ||
                node.type == types.variable_declaration
            ) {
                node.bindings.forEach(b => (non_global.add(b.id.name), globals.forEach(g => { if (g.name == b.id.name) globals.delete(b.id.name) })));
            }

            node = tvrs.next().value;
        }

        return [...globals.values()].reduce((red, out) => {
            const name = out.name;
            if ((window[name] && !(window[name] instanceof HTMLElement)) || name == "this")
                //Skip anything already defined on the global object. 
                return red;

            red.push(out);

            return red;
        }, []);
    },

    getRootVariables(ast) {
        const tvrs = ast.traverseDepthFirst();
        let node = null;
        var vars = [];
        while ((node = tvrs.next().value)) {
            if (node.type == types.function_declaration || node.type == types.arrow_function_declaration) {
                return node.args.map(e => e.name);
            }
        }
        return vars;
    },

    //Returns the argument names of the first function declaration defined in the ast
    getFunctionDeclarationArgumentNames(ast) {

        const tvrs = ast.traverseDepthFirst();
        let node = null;

        while ((node = tvrs.next().value)) {
            if (node.type == types.function_declaration || node.type == types.arrow_function_declaration) {
                return node.args.map(e => e.name);
            }
        }
        return [];
    },

    getRootVariables(lex) {
        let l = lex.copy();

        let ids = new Set();
        let closure = new Set();

        try {
            let result = JSParser(lex, env);

            if (result instanceof identifier) {
                ids.add(result.val);
            } else
                result.getRootIds(ids, closure);

            return { ids, ast: result, SUCCESS: true };
        } catch (e) {
            return { ids, ast: null, SUCCESS: false };
        }
    },

    types: types
};
