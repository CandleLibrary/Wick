import wick_parser_data from "./wick_parser.js";
import Whind from "@candlefw/whind";
import {lrParse} from "@candlefw/hydrocarbon";
export default function(lex, env) {
	if (typeof lex == "string")
		lex = new Whind(lex);
	return lrParse(lex, wick_parser_data, env);
}