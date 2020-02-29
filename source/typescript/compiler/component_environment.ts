import URL from "@candlefw/url";
import error from "../utils/error.js";

/*
    Stores information about a components environemnt,
    including URL location, errors generated, and loading state of dependency components
*/

export default class ComponentEnvironment {
    constructor(presets, env, url) {
        
        this.functions = env.functions;

        this.errors = [];
        this.prst = [presets];
        this.url = url || new URL;
        this.parent = null;
        this.res = null;
        this.pending_load_count = 0;
        
        this.pending = new Promise(res => this.res = res);

        this.ASI = true; // Automatic Semi-Colon Insertion
        
        if(env.resolve)
            this.setParent(env);
    }

    throw(){
        throw this.errors.map(e=>e.err + "").join("\n");
    }
    
    /** 
        Adds error statement to error stack 
        error_message 
    **/
    addParseError(msg, lex, url){
        const data = {msg, lex, url};
        this.errors.push({msg:error(error.ELEMENT_PARSE_FAILURE, data), data});
    }

    get presets() {
        return this.prst[this.prst.length - 1] || null;
    }

    incrementPendingLoads(){
        this.pending_load_count++;
    }

    pushPresets(prst) {
        this.prst.push(prst);
    }

    popPresets() {
        return this.prst.pop();
    }

    setParent(parent){
        this.parent = parent;
        parent.incrementPendingLoads();
    }

    resolve() {
        this.pending_load_count--;
        if (this.pending_load_count < 1) {
            if (this.parent)
                this.parent.resolve();
            else{
               this.res();
            }
        }
    }
}
