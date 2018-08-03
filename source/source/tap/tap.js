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
        this._ios_ = [];
    }

    _destroy_() {
        for (let i = 0, l = this._ios_.length; i < l; i++)
            this._ios_[i]._destroy_();
        this._ios_ = null;
        this._source_ = null;
        this._prop_ = null;
        this._modes_ = null;
    }

    load(data) {
        this._down_(data);
    }

    _down_(model, IMPORTED = false) {
        if (IMPORTED) {
            if (!(this._modes_ & IMPORT))
                return;
            if (this._modes_ & PUT)
                this._source_ ._model_[this._prop_] = model[this._prop_];
        }

        const value = model[this._prop_];

        if (typeof(value) !== "undefined") {
            for (let i = 0, l = this._ios_.length; i < l; i++)
                this._ios_[i]._down_(value);
        }
    }

    _up_(value, meta) {

        if (!(this._modes_ & (EXPORT | PUT))) {
            for (let i = 0, l = this._ios_.length; i < l; i++)
                this._ios_[i]._down_(value, meta);
            return;
        }

        if (this._modes_ & PUT)
            this._source_ ._model_[this._prop_] = value;

        if (this._modes_ & EXPORT)
            this._source_._up_(this, value, meta);


    }
}