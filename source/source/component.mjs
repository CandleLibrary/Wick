import { SourcePackage } from "./package.mjs";
import { ScriptNode } from "./compiler/nodes/script.mjs";
import { ClosureNode } from "./compiler/nodes/closure.mjs";
import URL from "@candlefw/url";
import whind from "@candlefw/whind";
/**
 * This module allows JavaScript to be used to describe wick components. 
 */

/* Example
	 myComponent = Component({
		component: "elements"// "Traditional" attributes can be defined and passed as variables
		model: //The presets object can be imported and fed into the component model object can be any piece of data. Wick will a
		// Exports and imports defined here. 
		export:[""],
		import:[""],
		//Functions begining with on are treated as message receivers. Other functions are treated as part of the source object. 
		on_message:function(presets){} // Wick will auto inject appropiate arguments 
		dom:`<element>(())</element> ${element(d)}` // "Traditional" wick nomenclature can be described here
		style: "./style.css"; // Urls can be supplied to import extra content // Style can also be defined in dom attribute.
	})
*/
export async function Component(data, presets = {}) {
    // Every component is a source node? If it includes source node attributes, then it becomes a source node. 
    // Otherwise it can be a pass-through or a regular element. 


    //Checking for existance of a DOM is necessary to preempt the creation of package. 
    //Since package can already handle cases of urls and pure data being passed. 
    let pkg = null,
        tree, model;


    if (data.dom) { //This can be either a HTML string or a url. Need to check for that. 
        try {
            pkg = await new SourcePackage(data.dom, presets, true);
        } catch (e) {
            throw e;
        }
        tree = pkg.skeletons[0].tree;
    } else {
        //This object contains other information that can be appended to a component, but the component itself is not mountable
    }

    for (name in data) {
        let v = data[name];
        switch (name) {
            case "dom": break;
            case "model": 
            break;
            case "schema": break;
            case "import": break;
            case "export": break;
            case "put": break;
            default:
                if (await InjectFunction(tree, name, v))
                    break;
                //Function injection

                //Component Scoped function

                //Closure Scoped function
        }
    }

    //TODO: If there is a component property and no Source attributes defined either in data or in the compiled tree, then extract the component from the package and discard package value.

    //Pass throughs are used to inject methods and attributes without affecting the dom. 

    /* Source node attributes
    	model
    	scheme
    	export 
    	import
    */

    // The default action with this object is to convert component back into a HTML tree string form that can be injected into the DOM of other components. 
    // Additional data can be added to this object before injection using this method.
    let return_value = function(data) {
        return tree.toString();
    }
    //This will ensure that something happens
    return_value.toString = function() { return tree.toString(); }

    //Unashamedly proxying the SourcePackage~mount method
    return_value.mount = function(ele, m = model) { return pkg.mount(ele, m) };

    return return_value;
}

async function InjectFunction(tree, function_id, function_value) {
    
    const formal_tag = function_id.slice(0, 3);
    

    if (formal_tag == "$on") {

    	const script = new ScriptNode();
    	const function_name = function_id.slice(3);

    	script.tag = "script";


    	tree.addChild(script);
    	
    	script.processAttributeHook("on", whind(`((${function_name}))`));

    	//if data is url pull that data in, other wise extract function data. 
    	if(typeof function_value == "string"){
    		//script.script_text = new URL().fetch()
    	}else{
    		script.processTextNodeHook(whind(function_value.toString().split(/[^\{]\{(.*)/)[1].slice(0,-1).trim()));
    	}

    	return true;
    } else if (formal_tag == "$$o") {

    	const closure = new ClosureNode();
    	const function_name = function_id.slice(4);

    	tree.addChild(closure);
    	
    	closure.processAttributeHook("on", whind(`((${function_name}))`), function_value);

    	return true;

    }

    return false;
}