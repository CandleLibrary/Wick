import lite from "./lite.js";
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

	return lite;
}())

export default tools