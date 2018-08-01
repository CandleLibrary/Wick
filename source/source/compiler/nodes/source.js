import { RootNode } from "./root";
import { Source } from "../../source";
import { Tap } from "../../tap/tap";

/**
 * Source nodes are used to hook into specific Models, and respond to `update` events from that model.
 * @class      SourceNode (name)
 */
export class SourceNode extends RootNode {
    constructor() {
        super();
    }

    _delegateTapBinding_() {
        return null;
    }

    _linkCSS_(css) {
        for (let node = this.fch; node; node = this.getN(node))
            node._linkCSS_(css);
    }

    _checkTapMethodGate_(name, lex) {
        return this._checkTapMethod_(name, lex);
    }

    /******************************************* BUILD ****************************************************/

    _build_(element, source, presets, errors, model, taps) {
        
        let data = {};

        let out_taps = [];

        let me = new Source(source, presets, element, this);

        let tap_list = this.tap_list;

        for (let i = 0, l = tap_list.length; i < l; i++) {
            let tap = tap_list[i],
                name = tap.name;
            me.taps[name] = new Tap(me, name, tap._modes_);
            out_taps.push(me.taps[name]);
        }

        for (let i = 0, l = this._attributes_.length; i < l; i++) {
            let attr = this._attributes_[i];
            if (!attr.value) {
                //let value = this.par.importAttrib()
                //if(value) data[attr.name];
            } else {
                data[attr.name] = attr.value;

            }
        }

        for (let node = this.fch; node; node = this.getN(node))
            node._build_(element, me, presets, errors, model, out_taps);

        return me;
    }

    /******************************************* HOOKS ****************************************************/

    _endOfElementHook_() {}

    _processAttributeHook_(name, lex) {
        if (this._checkTapMethodGate_(name, lex))
            return null;
        return { name, value: lex.slice() };
    }
}