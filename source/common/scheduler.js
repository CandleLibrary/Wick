/**
 * Used to call the Scheduler after a JavaScript runtime tick.
 *
 * Depending on the platform, caller will either map to requestAnimationFrame or it will be a setTimout.
 * @memberof module:wick~internals.router
 * @private
 */
const caller = (window && window.requestAnimationFrame) ? window.requestAnimationFrame : (f) => {
    setTimeout(f, 1)
};

/**
 * Handles updating objects. It does this by splitting up update cycles, to respect the browser event model. 
 *    
 * If any object is scheduled to be updated, it will be blocked from scheduling more updates the next JavaScript runtime tick.
 * 
 * @memberof module:wick~internals
 * @alias Scheduler
 */
const Scheduler = new(class {
    
    /**
     * Constructs the object.
     */
    constructor() {

        this.update_queue_a = new Array();
        this.update_queue_b = new Array();

        this.update_queue = this.update_queue_a;

        this.queue_switch = 0;

        this.callback = () => this.update();

        this.frame_time = performance.now();

        this._SCHD_ = false;

        
    }

    /**
     * Given an object that has a _SCHD_ Boolean property, the Scheduler will queue the object and call its .update function 
     * the following tick. If the object does not have a _SCHD_ property, the Scheduler will persuade the object to have such a property.
     * 
     * If there are currently no queued objects when this is called, then the Scheduler will user caller to schedule an update.
     *
     * @param      {Object}  object  The object to have updated.
     */
    queueUpdate(object) {

        if (object._SCHD_ || !object.scheduledUpdate instanceof Function)
            if (this._SCHD_)
                return;
            else
                return caller(this.callback);

        object._SCHD_ = true;

        this.update_queue.push(object);


        if (this._SCHD_)
            return;

        this._SCHD_ = true;

        caller(this.callback);
    }

    /**
     * Called by the caller function every tick. Calls .update on any object queued for an update. 
     */
    update() {

        this._SCHD_ = false;

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
            o._SCHD_ = false;
            o.scheduledUpdate(step_ratio);
        }

        uq.length = 0;
    }
})()

export {
    Scheduler
}