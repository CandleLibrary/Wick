import { removeFromArray } from "../../../utils/array.js";

// Mode Flag
export const KEEP = 0;
export const IMPORT = 1;
export const EXPORT = 2;
export const PUT = 4;

/**
 * Gateway for data flow. Represents a single "channel" of data flow. 
 * 
 * By using different modes, one can control how data enters and exits the scope context.
 * -`keep`: 
 *  This mode is the default and treats any data on the channel as coming from the model. The model itself is not changed from any input on the channel, and any data flow from outside the scope context is ignored.
 * -`put`:
 *  This mode will update the model to reflect inputs on the channel. This will also cause any binding to update to reflect the change on the model.
 * -`import`:
 *  This mode will allow data from outside the scope context to enter the context as if it came from the model. The model itself is unchanged unless put is specified for the same property.
 *  -`export`:
 *  This mode will propagate data flow to the parent scope context, allowing other scopes to listen on the data flow of the originating scope context.
 *  
 *  if `import` is active, then `keep` is implicitly inactive and the model no longer has any bearing on the value of the bindings.
 */
export class Tap {

    constructor(scope, prop, modes = 0) {
        this.scope = scope;
        this.prop = prop;
        this.modes = modes; // 0 implies keep
        this.ios = [];       
        this.value;
    }

    destroy() {
        this.ios.forEach(io => io.destroy());
        this.ios = null;
        this.scope = null;
        this.prop = null;
        this.modes = null;
        this.value = null;
    }

    linkImport(parent_scope){
        if ((this.modes & IMPORT)){
            const tap = parent_scope.getTap(this.prop);
            tap.addIO(this);
            
        }

    }

    load(data) {

        this.downS(data);

        //Make sure export occures as soon as data is ready. 
        const value = data[this.prop];

        if ((typeof(value) !== "undefined") && (this.modes & EXPORT))
            this.scope.up(this, data[this.prop]);
    }

    down(value, meta) {
        for (let i = 0, l = this.ios.length; i < l; i++) {
            this.ios[i].down(value, meta);
        }
    }

    downS(model, IMPORTED = false, meta = null) {
        const value = model[this.prop];

        if (typeof(value) !== "undefined") {
            this.value = value;

            if (IMPORTED) {
                if (!(this.modes & IMPORT))
                    return;

                if ((this.modes & PUT) && typeof(value) !== "function") {
                    if (this.scope.model.set)
                        this.scope.model.set({
                            [this.prop]: value
                        });
                    else
                        this.scope.model[this.prop] = value;
                }
            }

            for (let i = 0, l = this.ios.length; i < l; i++) {
                if (this.ios[i] instanceof Tap) {
                    this.ios[i].downS(model, true, meta);
                } else
                    this.ios[i].down(value, meta);
            }
        }
    }

    up(value, meta) {

        if (!(this.modes & (EXPORT | PUT)))
            this.down(value, meta);
        
        if ((this.modes & PUT) && typeof(value) !== "undefined") {

            if (this.scope.model.set)
                this.scope.model.set({
                    [this.prop]: value
                });
            else
                this.scope.model[this.prop] = value;
        }

        if (this.modes & EXPORT)
            this.scope.up(this, value, meta);
    }
    
    pruneIO(ele){
        const pending_delete = [];

        for(const io of this.ios)
            if(io.ele === ele)
                pending_delete = io;

        pending_delete.forEach(io=>io.destroy());
    }

    addIO(io) {
        if (io.parent === this)
            return;

        if (io.parent)
            io.parent.removeIO(io);

        this.ios.push(io);

        io.parent = this;
    }

    removeIO(io) {
        if (removeFromArray(this.ios, io)[0])
            io.parent = null;
    }

    discardElement(ele){
        this.parent.discardElement(ele);
    }
}

export class UpdateTap extends Tap {
    downS(model) {
        for (let i = 0, l = this.ios.length; i < l; i++)
            this.ios[i].down(model);
    }
    up() {}
}

// This serves as a NOOP for io methods that expect a Tap with addIO and RemoveIO operations
const noop = () => {};
export const NOOPTap = { addIO: noop, removeIO: noop, up: noop };
