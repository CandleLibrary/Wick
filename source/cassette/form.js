import {Cassette} from "./cassette"

class Form extends Cassette{
	constructor(parent, element){
		//Scan the element and look for inputs that can be mapped to the 
		super(parent, element);

		element.addEventListener("submit", (e)=>{
			//e.returnValue= false;
			var a = (new FormData(e.target)).entries();
			let t = a.next();
			var e = "";
			while(!t.done){
				e += `${t.value[0]}: ${t.value[1]} \n`;
				t = a.next();
			}
			console.log(e)
			debugger
		})

	}

	destructor(){

	}

	update(data){
		
	}
}

export {Form}
