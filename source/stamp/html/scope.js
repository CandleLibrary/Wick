import scope from "../../compiler/html/scope.js";
import element from "../../compiler/html/element.js";
import Attribute from "../../compiler/html/attribute.js";

scope.prototype.stamp = function(lite, output, indent_level = 0, eleid = [0]){

    this.attribs.set("is-scope", (new Attribute(["is-scope","",""])));

    element.prototype.stamp.call(this, lite, output, indent_level, eleid);
};