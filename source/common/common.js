import {Lexer} from "./string_parsing/lexer";



//Math
import {QBezier} from "./math/quadratic_bezier";
import {CBezier} from "./math/cubic_bezier";
import {TouchScroller} from "./event/touch_scroller";

/*********** String Parsing Basic Function ************************/

export {
	Lexer,
	QBezier,
	CBezier,
	TouchScroller
};

/****** Global Object Extenders *************/
//*
Element.prototype.getWindowTop = function(){
    return (this.offsetTop + ((this.parentElement) ? this.parentElement.getWindowTop() : 0));
};

Element.prototype.getWindowLeft = function(){
    return (this.offsetLeft + ((this.parentElement) ? this.parentElement.getWindowLeft() : 0));
};

Element.prototype.getParentWindowTop = function(bool = false){
    return (((bool ? this.offsetTop : 0))+((this.parentElement) ? this.parentElement.getParentWindowTop(true) : 0));
};

Element.prototype.getParentWindowLeft = function(bool = false){
    return (((bool ? this.offsetLeft : 0))+((this.parentElement) ? this.parentElement.getWindowLeft(true) : 0));
};

Element.prototype.getStyle = function(style_name){
	return window.getComputedStyle(this,null).getPropertyValue(style_name);
};

/**************** POLYFILLS ************************************/

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String}
 */
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}