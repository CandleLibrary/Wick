// Mode Flag
export const KEEP = 0;
export const IMPORT = 1;
export const EXPORT = 2;
export const PUT = 4;

/**
 * Gateway for data flow. Represents a single "channel" of data flow. 
 * 
 * By using different modes, one can control how data enters and exits the source context.
 * -`keep`: 
 *  This mode is the default and treats any data on the channel as coming from the model. The model itself is not changed, and any data flow from outside the source context is ignored.
 * -`put`:
 *  This mode will update the model to reflect updates on the channel.
 * -`import`:
 *  This mode will allow data from outside the source context to enter the context as if it came from the model.
 *  -`export`:
 *  This mode will propagate data flow to the outer source context, allowing other sources to listen on the data flow of the originating source context.
 *  
 *  if `import` is active, then `keep` is implicitly inactive and the model no longer has any bearing on the value of the channel.
 */
export class Tap {

    constructor(source, prop, modes = 0) {
        this._source_ = source;
        this._prop_ = prop;
        this._modes_ = modes; // 0 implies keep
        this.ios = [];

        if (modes & IMPORT && source.parent)
            source.parent.getTap(prop).ios.push(this);

    }

    destroy() {

        for (let i = 0, l = this.ios.length; i < l; i++)
            this.ios[i].destroy();

        this.ios = null;
        this._source_ = null;
        this._prop_ = null;
        this._modes_ = null;
    }

    load(data) {
        this.downS(data);
    }

    down(value, meta) {
        for (let i = 0, l = this.ios.length; i < l; i++) {
            this.ios[i].down(value, meta);
        }
    }

    downS(model, IMPORTED = false) {
        const value = model[this._prop_];

        if (typeof(value) !== "undefined") {

            if (IMPORTED) {
                if (!(this._modes_ & IMPORT))
                    return;

                if ((this._modes_ & PUT) && typeof(value) !== "function") {
                    this._source_.model[this._prop_] = value;
                }

            }

            for (let i = 0, l = this.ios.length; i < l; i++) {
                if (this.ios[i] instanceof Tap) {
                    this.ios[i].downS(model, true);
                } else
                    this.ios[i].down(value);
            }
        }
    }

    up(value, meta) {

        if (!(this._modes_ & (EXPORT | PUT)))
            this.down(value, meta);

        if ((this._modes_ & PUT) && typeof(value) !== "undefined") {
            this._source_.model[this._prop_] = value;
        }

        if (this._modes_ & EXPORT)
            this._source_.up(this, value, meta);



    }
}

export class UpdateTap extends Tap {
    downS(model) {
        for (let i = 0, l = this.ios.length; i < l; i++)
            this.ios[i].down(model);
    }
    up() {}
}