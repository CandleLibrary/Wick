import {Cassette} from "./cassette"

class Verify extends Cassette{
	update(data){
		//apply a filter object to the parent
		let result = data.verify(this.prop);
		if(!result.valid){
			this.element.innerHTML = result.reason;
		}else{
			this.element.innerHTML = "";
		}
	}
}

export {Verify}
