/**
	Javascript implementation of a touch scolling interface using touch events
*/
class TouchScroller {
	constructor(element, USE_MOMENTUM, touchid = 0){
		this.origin_x = 0;
		this.origin_y = 0;
		this.origin_old_x = 0;
		this.origin_old_y = 0;
		this.velocity_x = 0;
		this.velocity_y = 0;

		let time = 0;

		this.element = element;

		if(!touchid instanceof Number)
			touchid = 0;

		this.event_b = (e)=>{

			time = performance.now();

            var touch = e.touches[touchid];
        
      	    let delta_x = this.origin_x - touch.clientX;
      	    let delta_y = this.origin_y - touch.clientY;

      	    this.origin_old_y = this.origin_y;
      	    this.origin_old_x = this.origin_x;
            this.origin_x = touch.clientX;
            this.origin_y = touch.clientY;

            this.velocity_x = this.origin_old_x - this.origin_x;
            this.velocity_y = this.origin_old_y - this.origin_y;

            console.log(delta_x, delta_y)

            for(var i = 0, l = this.listeners.length; i<l; i++){
            	let out = {
	            	delta_x,
	            	delta_y
	            }
            	this.listeners[i](out);
            }
        }

        this.event_c = (e)=>{
        	
        	let  time_new = performance.now();

        	var touch = e.changedTouches[touchid];

        	let delta_x = this.origin_x - touch.clientX;
      	    let delta_y = this.origin_y - touch.clientY;

      	    this.origin_old_y = this.origin_y;
      	    this.origin_old_x = this.origin_x;
            this.origin_x = touch.clientX;
            this.origin_y = touch.clientY;

        	console.log(delta_x, delta_y)

            window.removeEventListener("touchmove", this.event_b);
            window.removeEventListener("touchend", this.event_c);
        }

        this.event_a = (e)=>{

        	time = performance.now();

            var touch = e.touches[touchid];
            
            if(!touch)
            	return;
            
            this.origin_y =  touch.clientY;
            this.origin_x =  touch.clientX;
            
            window.addEventListener("touchmove", this.event_b);
            window.addEventListener("touchend", this.event_c);
        }

        this.element.addEventListener("touchstart", this.event_a);

        this.listeners = [];
	}

	destructor(){
		this.listeners = null;
		this.element.removeEventListener("touchstart", this.event_a);
	}

	addEventListener(callback){
		if(callback instanceof Function){

			for(var i = 0; i < this.listeners.length; i++){
				if(this.listeners[i] == callback) return
			}

			this.listeners.push(callback);
		}
	}

	removeEventListener(callback){
		for(var i = 0; i < this.listeners.length; i++){
			if(this.listeners[i] == callback) {
				this.listeners.splice(i,1);
				return;
			}
		}		
	}
}

export {TouchScroller}