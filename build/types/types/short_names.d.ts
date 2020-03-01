/**
 * Global Document instance short name
 * @property DOC
 * @package
 * @memberof module:wick~internals
 * @type 	{Document}
 */
export declare const DOC: any;
/**
 * Global Window Instance short name
 * @property WIN
 * @package
 * @memberof module:wick~internals
 * @type 	{Window}
 */
export declare const WIN: any;
/**
 * Global HTMLElement class short name
 * @property EL
 * @package
 * @memberof module:wick~internals
 * @type 	{HTMLElement}
 */
export declare const EL: any;
/**
 * Global Object class short name
 * @property OB
 * @package
 * @memberof module:wick~internals
 * @type Object
 */
export declare const OB: ObjectConstructor;
/**
 * Global String class short name
 * @property STR
 * @package
 * @memberof module:wick~internals
 * @type String
 */
export declare const STR: StringConstructor;
/**
 * Global Array class short name
 * @property AR
 * @package
 * @memberof module:wick~internals
 * @type 	{Array}
 */
export declare const AR: ArrayConstructor;
/**
 * Global Number class short name
 * @property NUM
 * @package
 * @memberof module:wick~internals
 * @type 	{Number}
 */
export declare const NUM: NumberConstructor;
/**
 * Global Date class short name
 * @property DT
 * @package
 * @memberof module:wick~internals
 * @type 	{Date}
 */
export declare const DT: DateConstructor;
/**
 * Global Boolean class short name
 * @property BO
 * @package
 * @memberof module:wick~internals
 * @type 	{Boolean}
 */
export declare const BO: BooleanConstructor;
/***************** Functions ********************/
/**
 *  Global document.createElement short name function.
 * @method DOC
 * @package
 * @memberof module:wick~internals
 * @param 	{String}  		e   - tagname of element to create.
 * @return  {HTMLElement}  		- HTMLElement instance generated by the document.
 */
export declare const createElement: (e: any) => any;
/**
 *  Element.prototype.appendChild short name wrapper.
 * @method appendChild
 * @package
 * @memberof module:wick~internals
 * @param 	{HTMLElement}  		el  	- parent HTMLElement.
 * @return  {HTMLElement | HTMLNode}  		ch_el 	- child HTMLElement or HTMLNode.
 */
export declare const appendChild: (el: any, ch_el: any) => any;
/**
 *  Element.prototype.cloneNode short name wrapper.
 * @method cloneNode
 * @package
 * @memberof module:wick~internals
 * @param 	{HTMLElement}  		el   - HTMLElement to clone.
 * @return  {Boolean}  			bool - Switch for deep clone
 */
export declare const cloneNode: (el: any, bool: any) => any;
/**
 *  Element.prototype.getElementsByTagName short name wrapper.
 * @method _getElementByTag_
 * @package
 * @memberof module:wick~internals
 * @param 	{HTMLElement}  		el   - HTMLElement to find tags on.
 * @return  {String}  			tag - tagnames of elements to find.
 */
export declare const _getElementByTag_: (el: any, tag: any) => any;
/**
 *  Shortname for `instanceof` expression
 * @method _instanceOf_
 * @package
 * @param      {object}  inst    The instance
 * @param      {object}  constr  The constructor
 * @return     {boolean}  the result of `inst instanceof constr`
 */
export declare const _instanceOf_: (inst: any, constr: any) => boolean;
export declare const _SealedProperty_: (object: any, name: any, value: any) => any;
export declare const _FrozenProperty_: (object: any, name: any, value: any) => any;