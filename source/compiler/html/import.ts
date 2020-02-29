import ElementNode from "./element.js";
export default class Import extends ElementNode{

	constructor(env,presets, tag, children, attribs){
		super(env,presets, "import", null, attribs);
	}
	
	loadAST(){/*intentional*/return}
		
	loadURL(){/*intentional*/return}
}
