const caller = (window && window.requestAnimationFrame) ? window.requestAnimationFrame : (f) => {
    setTimeout(f, 1)
};
/** 
    The Scheduler handles updating objects. It does this by splitting up update cycles, 
    to respect the browser event model. 

    If any object is scheduled to be updated, it will be blocked from scheduling more updates 
    until its own update method is called.
*/

const Scheduler = new(class {

    constructor() {

        this.update_queue_a = new Array();
        this.update_queue_b = new Array();

        this.update_queue = this.update_queue_a;

        this.queue_switch = 0;


        this.callback = () => this.update();

        this.frame_time = performance.now();

        this.____SCHEDULED____ = false;
    }

    queueUpdate(object) {

        if (object.____SCHEDULED____ || !object.update instanceof Function)
            if (this.____SCHEDULED____)
                return;
            else
                return caller(this.callback);

        object.____SCHEDULED____ = true;

        this.update_queue.push(object);


        if (this.____SCHEDULED____)
            return;

        this.____SCHEDULED____ = true;

        caller(this.callback);
    }

    update() {

        this.____SCHEDULED____ = false;

        let uq = this.update_queue;

        if(this.queue_switch == 0)
            (this.update_queue = this.update_queue_b, this.queue_switch = 1);
        else
            (this.update_queue = this.update_queue_a, this.queue_switch = 0);

        let time = performance.now();

        let diff = time - this.frame_time;

        this.frame_time = time;

        let step_ratio = (diff * 0.06); //  step_ratio of 1 = 16.66666666 or 1000 / 60 for 60 FPS

        for (let i = 0, l = uq.length, o = uq[0]; i < l; o = uq[++i]){
            o.____SCHEDULED____ = false;
            o.update(step_ratio);
        }

        uq.length = 0;
    }
})()

export {
    Scheduler
}