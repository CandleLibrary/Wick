import {Lexer} from "./common/string_parsing/lexer"
import {Tokenizer} from "./common/string_parsing/tokenizer"

//Time
import {months} from "./common/date_time/months"
import {dow} from "./common/date_time/days_of_week"
import {GetDayStartAndEnd} from "./common/date_time/day_start_and_end_epoch"
import {float24to12ModTime} from "./common/date_time/time.js"

//Math
import {QBezier} from "./common/math/quadratic_bezier"
import {CBezier} from "./common/math/cubic_bezier"
import {TurnQueryIntoData, TurnDataIntoQuery} from "./common/url/url"
import {TouchScroller} from "./common/event/touch_scroller"


/*********** String Parsing Basic Function ************************/
/**
	If a string object is passed, creates a lexer that tokenize the input string. 
*/
function Lex(string){
	if(typeof(string) !== "string"){
		console.warn("Cannot create a lexer on a non-string object!");
		return null;
	}

	return new Lexer(new Tokenizer(string));
}

export {
	Lex,
	Lexer, 
	Tokenizer,
	months,
	dow,
	QBezier,
	CBezier,
	TurnQueryIntoData,
	TurnDataIntoQuery,
	GetDayStartAndEnd,
	TouchScroller,
	float24to12ModTime
};

/****** Global Object Extenders *************/

Element.prototype.getWindowTop = function(){
    return (this.offsetTop + ((this.parentElement) ? this.parentElement.getWindowTop() : 0));
}

Element.prototype.getWindowLeft = function(){
    return (this.offsetLeft + ((this.parentElement) ? this.parentElement.getWindowLeft() : 0));
}

Element.prototype.getParentWindowTop = function(bool = false){
    return (((bool ? this.offsetTop : 0))+((this.parentElement) ? this.parentElement.getParentWindowTop(true) : 0));
}

Element.prototype.getParentWindowLeft = function(bool = false){
    return (((bool ? this.offsetLeft : 0))+((this.parentElement) ? this.parentElement.getWindowLeft(true) : 0));
}

Element.prototype.getStyle = function(style_name){
	return window.getComputedStyle(this,null).getPropertyValue(style_name);
}