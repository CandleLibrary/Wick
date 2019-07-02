import ElementNode from "./element.js";
export default class Import extends ElementNode{

	constructor(env, tag, children, attribs, presets){
		super(env, "import", null, attribs, presets);
	}
	
	loadAST(){/*intentional*/return;}
		
	loadURL(){/*intentional*/return;}
}
