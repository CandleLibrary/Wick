let GLOBAL = (()=>{
	let linker = null;
	return {
		get linker(){
			return linker;
		},
		set linker(l){
			if(!linker)
				linker = l;
		}
	}
})

export {GLOBAL}