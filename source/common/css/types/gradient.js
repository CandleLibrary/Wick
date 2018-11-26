import {
	CSS_Color 
} from "./color";

import {
	CSS_Percentage
} from "./percentage";

import {
	CSS_Length
} from "./length";

class Stop{
	constructor(color, percentage){
		this.color = color;
		this.percentage = percentage || null;
	}

	toString(){
		return `${this.color}${(this.percentage)?" "+this.percentage:""}`;
	}
}

export class CSS_Gradient{

	static parse(l, rule, r) {
        let tx = l.tx,
            pky = l.pk.ty;
        if (l.ty == l.types.id) {
        	switch(l.tx){
        		case "linear-gradient":
        		l.n.a("(");
        		let dir,num,type ="deg";
        		if(l.tx == "to"){

        		}else if(l.ty == l.types.num){
        			num = parseFloat(l.ty);
        			type = l.n.tx;
        			l.n.a(',');
        		}
        		let stops = [];
        		while(!l.END && l.ch != ")"){
        			let v = CSS_Color.parse(l, rule, r);
        			let len = null;

        			if(l.ch == ")") {
        				stops.push(new Stop(v, len));
        				break;
        			}
        			
        			if(l.ch != ","){
	        			if(!(len = CSS_Length.parse(l, rule, r)))
	        				len = CSS_Percentage.parse(l,rule,r);
        			}else{
        				l.n;
        			}

        			stops.push(new Stop(v, len));
        		}
        		l.a(")");
        		let grad = new CSS_Gradient();
        		grad.stops = stops;
        		return grad;
        	}
        }
        return null;
    }


	constructor(type = 0){
		this.type = type; //linear gradient
		this.direction = new CSS_Length(0, "deg");
		this.stops = [];
	}

	toString(){
		let str = [];
		switch(this.type){
			case 0:
			str.push("linear-gradient(");
			if(this.direction !== 0)
				str.push(this.direction.toString() + ",");
			break;
		}

		for(let i = 0; i < this.stops.length; i++)
			str.push(this.stops[i].toString()+((i<this.stops.length-1)?",":""));

		str.push(")");

		return str.join(" ");
	}
}