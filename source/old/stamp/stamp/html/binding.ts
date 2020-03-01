import binding from "../../compiler/html/binding.js.js";

binding.prototype.stamp = function(lite, output, indent_level = 0, eleid = [0]){
	//If this is a single identifier then the data from the scope update goes straight into the receiving object
	return this;
};