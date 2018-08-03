/**
 * Factory object for Creating Source trees.  Encapsulates construction information derived from the HTML AST.  
 * 
 * @param      {HTMLElement}  element      The element
 * @param      {Function}  constructor      The constructor for the object the Skeleton will create.
 * @param      {Object}  data  Data pulled from a tags attributes
 * @param      {Presets}  presets  The global Presets instance.
 * @memberof module:wick~internals.source
 * @alias Skeleton  
 */
export class Skeleton {

    /**
        Constructor of Skeleton
    */
    constructor(tree, presets) {
        this.tree = tree;
        this._presets_ = presets;
    }


    /**
     * Constructs Source tree and returns that. 
     * @param {HTMLElement} element - host HTML Element. 
     * @param      {<type>}  primary_model    The model
     * @return     {<type>}  { description_of_the_return_value }
     */
    flesh(element, primary_model = null) {

        let Source = this.____copy____(element, null, primary_model);

        if (Source)
            Source.load(primary_model);

        return Source;
    }

    /**
     * Extends a given DOM tree and, optionally, a Source tree with it's own internal  tree.
     * @param {HTMLElement} parent_element - HTML Element of the originating Source. 
     * @param {<type>}  parent_source   The parent source
     */
    extend(parent_element = null, parent_source = null) {
        this.____copy____(parent_element, parent_source);
    }

    /**
        Constructs a new object, attaching to elements hosted by a Source object. If the component to be constructed is a Source the 
        parent_element HTMLElement gets swapped out by a cloned HTMLElement that is hosted by the newly constructed Source.

        @param {HTMLElement} parent_element - HTML Element of the originating tree. 

        @protected
    */
    ____copy____(parent_element = null, parent_source = null, primary_model = null) {
        //List of errors generated when building DOM
        let errors = [];

        let source = this.tree._build_(parent_element, parent_source, this._presets_, errors);

        if (errors.length > 0) {
            //TODO!!!!!!Remove all _bindings_ that change Model. 
            //source.kill_up_bindings();
            errors.forEach(e => console.log(e));
        }

        return source;
    }
}