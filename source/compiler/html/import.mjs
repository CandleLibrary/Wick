import CompilerEnv from "../compiler_env.mjs";
import wick_compile from "../wick.mjs";
import ElementNode from "./element.mjs";

import whind from "@candlefw/whind";
import URL from "@candlefw/url";

export default class Import extends ElementNode{

	constructor(env, tag, children, attribs, presets){
		super(env, "import", null, attribs, presets);
		this.url = URL.resolveRelative(this.getAttribute("url"), env.url);
		this.load(env);
	}

	async load(env){
		try{
			const own_env = new CompilerEnv(env.presets, env);
			own_env.setParent(env);

			const txt_data = await this.url.fetchText();

			own_env.pending++;

			const ast = wick_compile(whind(txt_data), own_env);
			own_env.resolve();

		}catch(err){
			console.error(err);
		}
	}
		
	loadURL(){/*Intentional*/ return;}
}
