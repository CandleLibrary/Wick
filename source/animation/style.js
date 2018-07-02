import {
    Color
} from "./color"

/**
    CSS style values:
    | Name   | Type | Size | appends / forms|
    | --- | --- | --- | --- |
    |color | 8bit int | 4 x 1 | #ABCD(as hex vals)|
    | length | 32bit float | 1 | px em|
    | percentage | 32bit float | 1 | % |
    | string | string | 1-inf | none|
    | time | 32bit int | 1 | switch|

     CSS styles props
     | name | use | form | css reader |
     | --- | --- | --- | --- |
     | color | Color of of Font | color : rgba(0,0,0,0) | color : <color> |
     | background | Style of background | b | background : color string string string|
     | width | Horizontal Dimension of Object | | width : [<length> || <percentage>]
     | height | Vertical Dimension of Object | | height : [<length> || <percentage>]
     | top | Vertical Position of Object | | top : [<length> || <percentage>]
     | bottom | Vertical Position of Object | | bottom : [<length> || <percentage>]
     | left | Horizontal Position of Object | | left : [<length> || <percentage>]
     | right | Horizontal Position of Object | | right : [<length> || <percentage>]
*/



/**
    JavaScript representation of a style selector
*/
class Value{
    constructor(name, value){
        this.name = name;
        this.value = value;
    }

    transformTo(element, style){
        if(style.name = this.name){
            this.toElement()
        }
    }

    toElement(element){
        element.style[this.name] = this.toString();
    }

    toString(){
        return `${this.value}`;
    }
}


class ColorComponent extends Style {
    constructor(name){
        super(name || color);
    }
}
