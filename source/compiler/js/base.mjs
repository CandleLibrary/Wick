
import types from "./types.mjs";
export default class{
	constructor(){
	}
	getRootIds(ids) {}
	*traverseDepthFirst (){ yield this }
	skip (trvs) {

		for(let val = trvs.next().value; val && val !== this ;val = trvs.next().value);

		return trvs;
	}
	spin(trvs){
        let val = trvs.next().value;
        while(val !== undefined && val !== this ){val = trvs.next().value};
     }
     toString(){return this.render()}
     render(){return ""}
}
