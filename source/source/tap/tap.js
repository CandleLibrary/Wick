// Method Flags
export const KEEP = 0;
export const IMPORT = 1;
export const EXPORT = 2;
export const PUT = 4;

/**
 * Tap are the gates to the component and the model. 
 * They allow data to flow bi-directionally and cross-directionally.
 */
export class Tap {

    constructor(source, prop, modes = 0) {
        this._source_ = source;
        this._prop_ = prop;
        this._modes_ = modes; // implies keep
        this._ios_ = [];
    }

    _destroy_() {
        for (let i = 0, l = this._ios_.length; i < l; i++)
            this._ios_[i]._destroy_();
        this._source_ = null;
        this._prop_ = null;
        this._modes_ = null;
        this._ios_ = null;
    }

    load(data) {
        this._down_(data);
    }
    
    _down_(model, IMPORTED = false) {
        if (IMPORTED) {
            if (!(this._modes_ & IMPORT))
                return;
            if (this._modes_ & PUT)
                this._source_._m[this._prop_] = model[this._prop_];
        }

        const value = model[this._prop_];

        if (typeof(value) !== "undefined") {
            for (let i = 0, l = this._ios_.length; i < l; i++)
                this._ios_[i]._down_(value);
        }
    }

    _up_(value, meta) {
        //console.log("message received on channel", this._prop_, value, meta, this);

        if (this._modes_ & PUT)
            this._source_._m[this._prop_] = value;

        if (this._modes_ & EXPORT)
            this._source_._up_(this, value, meta);

        if (!(this._modes_ & (EXPORT | PUT)))
            for (let i = 0, l = this._ios_.length; i < l; i++)
                this._ios_[i]._down_(value, meta);
    }
}