import URL from "@candlefw/url";

// This prevents env variable access conflicts when concurrent compilation
// are processing text data. 

export default class ComponentEnvironment {
    constructor(presets, env, url) {
        
        this.functions = env.functions;

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
    
    /** Adds error statement to error stack **/
    error(){

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
