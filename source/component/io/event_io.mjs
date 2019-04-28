import { IOBase } from "./io";

export class EventIO {
    constructor(scope, errors, taps, element, event, event_bind, argument) {

        let Attrib_Watch = (typeof element[event] == "undefined");

        this.parent = scope;
        scope.ios.push(this);

        this.ele = element;
        this.event_bind = new IOBase(scope.getTap(event_bind.tap_name));
        this.event = event.replace("on", "");

        this.prevent_defaults = true;
        if (this.event == "dragstart") this.prevent_defaults = false;
        this.argument = null;
        this.data = null;

        if (argument) {
            switch (argument.type) {
                case 0: //DYNAMICbindingID
                    this.argument = argument._bind_(scope, errors, taps, this);
                    break;
                case 1: //RAW_VALUEbindingID
                    this.data = argument.val;
                    break;
                case 2: //TEMPLATEbindingID
                    if (argument.bindings.length < 1) // Just a variable less expression.
                        this.data = argument.func();
                    else
                        this.argument = argument._bind_(scope, errors, taps, this);
                    break;
            }
        }


        if (Attrib_Watch) {
            this.event_handle = new MutationObserver((ml) => {
                ml.forEach((m) => {
                    if (m.type == "attributes") {
                        if (m.attributeName == event) {
                            this.handleAttribUpdate(m);
                        }
                    }
                });
            });
            this.event_handle.observe(this.ele, { attributes: true });
        } else {
            this.event_handle = (e) => this.handleEvent(e);
            this.ele.addEventListener(this.event, this.event_handle);
        }
    }

    /**
     * Removes all references to other objects.
     * Calls destroy on any child objects.
     */
    destroy() {
        if (this.argument)
            this.argument.destroy();
        this.event_handle = null;
        this.event_bind.destroy();
        this.argument = null;
        this.ele.removeEventListener(this.event, this.event_handle);
        this.ele = null;
        this.event = null;
        this.parent.removeIO(this);
        this.parent = null;
        this.data = null;
    }

    handleEvent(e) {
        this.event_bind.up(this.data, { event: e });

        if (this.prevent_defaults /*|| prevent === true*/) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
    }

    handleAttribUpdate(e) {
        this.event_bind.up(e.target.getAttribute(e.attributeName), { mutation: e });
    }
}
