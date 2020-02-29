import element from "../../compiler/html/style.js";

element.prototype.stamp = function(lite, output){
    for(const child of this.children){
        child.stamp(lite, output);
    }
};