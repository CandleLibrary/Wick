import {Cassette} from "./cassette"

class Input extends Cassette{
	constructor(parent, element){
		//Scan the element and look for inputs that can be mapped to the
		super(parent, element);

		//Inputs in forms are automatically hidden.
		this.element.display = "none";

		this.element.addEventListener("input", ()=>{
				var data = {}
				data[this.prop] = this.element.value;
				this.parent.model.add(data);
		})
	}

	update(data){

		if(!data[this.prop]) return;

		switch(this.element.type){
			case "date":
				this.element.value = (new Date(parseInt(data[this.prop]))).toISOString().split("T")[0];
			break;
			case "time":
				this.element.value = `${("00"+(data[this.prop] | 0)).slice(-2)}:${("00"+((data[this.prop]%1)*60)).slice(-2)}:00.000`;
			break;
			case "text":
				this.element.value = (data[this.prop] != undefined) ? data[this.prop] : "";
			break;
			default:

				var t = this.element.classList[0];
				
				switch(t){
					case "modulo_time":
						var time = data[this.prop];
						var IS_PM = (time/12 > 1);
						var minutes = ((time%1)*60)|0;
						var hours = (((time|0)%12) != 0) ? (time|0)%12 : 12;

						this.element.value = (hours + ":" + ("0"+minutes).slice(-2)) + ((IS_PM)? " PM":" AM");
					break;

					default:
						this.element.value = (data[this.prop] != undefined) ? data[this.prop] : "";
				}
			break;
		}
	}
}

export {Input}
