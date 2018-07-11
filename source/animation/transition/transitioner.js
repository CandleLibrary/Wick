import { Scheduler } from "../../common/scheduler"

export class Transitioner {
    constructor(element, data) {
        /* extract transition infromation from css or the data */

        this.element = element;

        this.set(element, data);
    }

    set() {
        this.element.style.opacity = 0;
        this.element.style.transition = "opacity 2s";
    }

    set_in() {
        this.element.style.transition = `opacity 2s`;
        
        Scheduler.queueUpdate(this);

        return 0.8;
    }

    set_out() {
        this.element.style.opacity = 0;
        return 0.8;
    }

    finalize_out() {
    	this.element.style.opacity = 0;
    }

    update(){
        this.element.style.opacity = 1;
    }
}