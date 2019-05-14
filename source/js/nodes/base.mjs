
import types from "../types.mjs";
export default class{
	constructor(){
	}
	getRootIds(ids) {}
	*traverseDepthFirst (){ return this }
	spin(trvs){
        let val = trvs.next().value;
        while(val !== undefined && val !== this ){val = trvs.next().value};
     }
}
