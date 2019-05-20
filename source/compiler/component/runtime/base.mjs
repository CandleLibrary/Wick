import { View } from "../../observer/observer";


/**
 *   The base class {@link Scope} and {@link ScopeContainer} extend.  
 *   @param {Scope} parent - The parent {@link Scope}, used internally to build a hierarchy of Scopes.
 *   @param {Object} data - An object containing HTMLELement attribute values and any other values produced by the template parser.
 *   @param {Presets} presets - An instance of the {@link Presets} object.
 *   @memberof module:wick~internals.scope
 *   @interface
 *   @alias ScopeBase
 *   @extends View
 */
export class ScopeBase extends View {

    constructor(parent = null, presets = {}, element = null) {

        super();

       
    }
}
