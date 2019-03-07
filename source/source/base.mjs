import { View } from "../view/view";


/**
 *   The base class {@link Source} and {@link SourceContainer} extend.  
 *   @param {Source} parent - The parent {@link Source}, used internally to build a hierarchy of Sources.
 *   @param {Object} data - An object containing HTMLELement attribute values and any other values produced by the template parser.
 *   @param {Presets} presets - An instance of the {@link Presets} object.
 *   @memberof module:wick~internals.source
 *   @interface
 *   @alias SourceBase
 *   @extends View
 */
export class SourceBase extends View {

    constructor(parent = null, presets = {}, element = null) {

        super();

       
    }
}
