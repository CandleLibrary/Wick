/**
 * Used to call the Scheduler after a JavaScript runtime tick.
 *
 * Depending on the platform, caller will either map to requestAnimationFrame or it will be a setTimout.
 * @memberof Scheduler
 * @private
 */
const caller = (window && window.requestAnimationFrame) ? window.requestAnimationFrame : (f) => {
    setTimeout(f, 1);
};



/**
 * Handles updating objects. It does this by splitting up _update_ cycles, to respect the browser event model. 
 *    
 * If any object is scheduled to be updated, it will be blocked from scheduling more updates the next JavaScript runtime tick.
 * 
 * @memberof module:wick~internals
 * @alias Scheduler
 */
class Scheduler {
    /**
     * Constructs the object.
     */
    constructor() {

        this.update_queue_a = [];
        this.update_queue_b = [];

        this.update_queue = this.update_queue_a;

        this.queue_switch = 0;

        this.callback = () => this._update_();

        this.frame_time = performance.now();

        this._SCHD_ = false;


    }

    /**
     * Given an object that has a _SCHD_ Boolean property, the Scheduler will queue the object and call its ._update_ function 
     * the following tick. If the object does not have a _SCHD_ property, the Scheduler will persuade the object to have such a property.
     * 
     * If there are currently no queued objects when this is called, then the Scheduler will user caller to schedule an _update_.
     *
     * @param      {Object}  object  The object to have updated.
     */
    queueUpdate(object, timestart = 1, timeend = 0) {
        if (object._SCHD_ || object._SCHD_ > 0)
            if (this._SCHD_)
                return;
            else
                return caller(this.callback);

        object._SCHD_ = (timestart | ((timestart + timeend) << 16));

        this.update_queue.push(object);

        if (this._SCHD_)
            return;

        this._SCHD_ = true;

        caller(this.callback);
    }

    /**
     * Called by the caller function every tick. Calls ._update_ on any object queued for an _update_. 
     */
    _update_() {

        this._SCHD_ = false;

        let uq = this.update_queue;

        if (this.queue_switch == 0)
            (this.update_queue = this.update_queue_b, this.queue_switch = 1);
        else
            (this.update_queue = this.update_queue_a, this.queue_switch = 0);

        let time = performance.now() | 0;

        let diff = Math.ceil(time - this.frame_time) | 1;

        this.frame_time = time;

        let step_ratio = (diff * 0.06); //  step_ratio of 1 = 16.66666666 or 1000 / 60 for 60 FPS


        for (let i = 0, l = uq.length, o = uq[0]; i < l; o = uq[++i]) {
            let timestart = ((o._SCHD_ & 65535)) - diff;
            let timeend = ((o._SCHD_ >> 16) & 65535) - diff;


            if (timestart > 0) {
                o._SCHD_ = 0;
                this.queueUpdate(o, timestart, timeend);
                continue;
            }


            if (timeend > 0) {
                this.queueUpdate(o, timestart, timeend);
                continue;
            } else o._SCHD_ = 0;

            o._scheduledUpdate_(step_ratio);
        }

        uq.length = 0;
    }
}

const scheduler = new Scheduler();

export {
    scheduler as Scheduler
};