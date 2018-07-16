import {Lexer} from "./string_parsing/lexer"

//Time
import {months} from "./date_time/months"
import {dow} from "./date_time/days_of_week"
import {GetDayStartAndEnd} from "./date_time/day_start_and_end_epoch"
import {float24to12ModTime} from "./date_time/time.js"

//Math
import {QBezier} from "./math/quadratic_bezier"
import {CBezier} from "./math/cubic_bezier"
import {TurnQueryIntoData, TurnDataIntoQuery} from "./url/url"
import {TouchScroller} from "./event/touch_scroller"

//CSS
import {CSSParser} from "./css/parser/parser"


/*********** String Parsing Basic Function ************************/

export {
	Lexer, 
	months,
	dow,
	QBezier,
	CBezier,
	TurnQueryIntoData,
	TurnDataIntoQuery,
	GetDayStartAndEnd,
	TouchScroller,
	float24to12ModTime,
	CSSParser
};

/****** Global Object Extenders *************/
//*
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
//*/