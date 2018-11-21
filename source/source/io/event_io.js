import { IOBase } from "./io";

export class EventIO {
    constructor(source, errors, taps, element, event, event_bind, msg) {

        let Attrib_Watch = (typeof element[event] == "undefined");

        this.parent = source;
        source._ios_.push(this);

        this._ele_ = element;
        this._event_bind_ = new IOBase(source.getTap(event_bind.tap_name));
        this._event_ = event.replace("on", "");

        this.prevent_defaults = false;
        if (this._event_ == "dragstart") this.prevent_defaults = false;
        this._msg_ = null;
        this.data = null;
        if (msg) {
            switch (msg.type) {
                case 0: //DYNAMIC_BINDING_ID
                    this._msg_ = msg._bind_(source, errors, taps, this);
                    break;
                case 1: //RAW_VALUE_BINDING_ID
                    this.data = msg.txt;
                    break;
                case 2: //TEMPLATE_BINDING_ID
                    if (msg._bindings_.length < 1) // Just a variable less expression.
                        this.data = msg.func();
                    else
                        this._msg_ = msg._bind_(source, errors, taps, this);
                    break;
            }
        }


        if (Attrib_Watch) {
            this._event_handle_ = new MutationObserver((ml) => {
                ml.forEach((m) => {
                    if (m.type == "attributes") {
                        if (m.attributeName == event) {
                            this._handleAttribUpdate_(m);
                        }
                    }
                });
            });
            this._event_handle_.observe(this._ele_, { attributes: true });
        } else {
            this._event_handle_ = (e) => this._handleEvent_(e);
            this._ele_.addEventListener(this._event_, this._event_handle_);
        }
    }

    /**
     * Removes all references to other objects.
     * Calls _destroy_ on any child objects.
     */
    _destroy_() {
        if (this._msg_)
            this._msg_._destroy_();
        this._event_handle_ = null;
        this._event_bind_._destroy_();
        this._msg_ = null;
        this._ele_.removeEventListener(this._event_, this._event_handle_);
        this._ele_ = null;
        this._event_ = null;
        this.parent.removeIO(this);
        this.parent = null;
        this.data = null;
    }

    _handleEvent_(e) {
        this._event_bind_._up_(this.data, { event: e });

        if (this.prevent_defaults) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
    }

    _handleAttribUpdate_(e) {
        this._event_bind_._up_(e.target.getAttribute(e.attributeName), { mutation: e });
    }
}