import {types } from "@candlefw/js";

export default function(url){
    const stmts = ast.statements;

    //Find import and export statements and remove from them AST. Replace with there children
    let REPLACE = null;

    for(const node of ast.traverseDepthFirst()){
        
        if(REPLACE) 
        	REPLACE(node)

        if(node.type == types.export_declaration)
        	REPLACE = (n)=>(node.replace(n), REPLACE = null);
    }

    //Extract the template string from the classes. Use the wick compiler to turn this into a component ast. 

    //The Classes 

}

//Processes imports from the stmts list. 
function processImport(import_stmt){

}

function processExport(export_stmt){

}

function processClass(class_declaration){

}

