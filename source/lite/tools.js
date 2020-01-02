import lite from "./lite.js";
import stamp from "../stamp/stamp.js";
import createComponent from "./component/component.js";

const tools =  (function(){

	/* Exports built in components into a self contained page. */
	lite.export = function(){
		const map = createComponent.map;

		const html = `
	${[...map.entries()].map(v=>(v[1].template.id = v[0] + "", v[1].template.outerHTML)).join("")}
		`
		const js = `
		${[...map.entries()].map(v=>`wick_lite.load(document.getElementById("${v[0]}"), ${v[1].fn.toString().replace("anonymous(", "(")})`).join(";")}
		`
		console.log(html, js, createComponent.map)
		debugger
	}

	lite.createSelfContainedComponent;

	/* Creates a single file formatted as HTML capable of running as a single page. */
	lite.createSelfContainedPage = async function(root_component, headers, scripts){

		// Root component is the main component that hosts all other components.
		
		//clear componnet map and and create a new stamped component repository. 
		let map = (createComponent.map = new Map);

		const root = await root_component.stamp();

		const file = [];

		file.push("<!DOCTYPE html>");
		file.push("<html>");
		file.push("<head>");
		file.push("<script src=\"../../build/wick.lite.js\"></script>");
		file.push("</head>");
		file.push("<body>");
		file.push([...map.entries()].map(v=>(v[1].template.id = v[0] + "", v[1].template.outerHTML)).join(""));
		file.push("<script>");
		file.push([...map.entries()].map(v=>`wick.load(document.getElementById("${v[0]}"), ${v[1].fn.toString().replace("anonymous(", "(")})`).join(";"))
		file.push(`document.body.appendChild(wick.createComponent("${root.hash}").ele)`)
		file.push("</script>");
		file.push("</body>");
		file.push("</html>")

		return file.join("\n");
	}

	return lite;
}())

export default tools