import { Animation } from "./animation";
import { TransformTo } from "./transformto";
import { Scheduler } from "../common/scheduler";

const Transitioneer = (function() {

    let obj_map = new Map();
    let ActiveTransition = null;

    class Transition {
        constructor() {
            this.in_duration = 0;
            this.out_duration = 0;

            this.time = 0;

            // If set to zero transitions for out and in will happen simultaneously.
            this.in_delay = 0;

            this.in_seq = [];
            this.out_seq = [];

            this.TT = {};
            //Final transition time is given by max(start_len+in_delay, end_len);\
            ActiveTransition = this;
        }

        _destroy_() {
                let removeProps = function(seq) {
                    if (!seq.DESTROYED)
                        obj_map.delete(seq.obj);
                    seq._destroy_();
                };
                this.in_seq.forEach(removeProps);
                this.out_seq.forEach(removeProps);
                this.in_seq = null;
                this.out_seq = null;
                this.res = null;
            }

            in (anim_data_or_duration = 0, delay = 0) {

                let that = ActiveTransition,
                    seq;

                if (typeof(anim_data_or_duration) == "object") {
                    if (anim_data_or_duration.match && that.TT[anim_data_or_duration.match]) {
                        let duration = anim_data_or_duration.duration;
                        let easing = anim_data_or_duration.easing;
                        seq = that.TT[anim_data_or_duration.match](anim_data_or_duration.obj, duration, easing);
                    } else
                        seq = Animation.createSequence(anim_data_or_duration);

                    //Parse the object and convert into animation props. 
                    if (seq) {
                        that.in_seq.push(seq);
                        that.in_duration = Math.max(that.in_duration, seq.duration);

                        if (obj_map.get(seq.obj)) {
                            let other_seq = obj_map.get(seq.obj);
                            other_seq.removeProps(seq);
                        }

                        obj_map.set(seq.obj, seq);
                    }


                } else
                    that.in_duration = Math.max(that.in_duration, parseInt(delay) + parseInt(anim_data_or_duration));

                return that.in;
            }


        out(anim_data_or_duration = 0, delay = 0, in_delay = 0) {
            //Every time an animating component is added to the Animation stack delay and duration need to be calculated.
            let that = ActiveTransition;
            //The highest in_delay value will determine how much time is afforded before the animation for the in portion are a started

            if (typeof(anim_data_or_duration) == "object") {
                if (anim_data_or_duration.match) {
                    that.TT[anim_data_or_duration.match] = TransformTo(anim_data_or_duration.obj);
                } else {
                    let seq = Animation.createSequence(anim_data_or_duration);
                    if (seq) {
                        that.out_seq.push(seq);
                        that.out_duration = Math.max(that.out_duration, seq.duration);

                        if (obj_map.get(seq.obj)) {
                            let other_seq = obj_map.get(seq.obj);
                            other_seq.removeProps(seq);
                        }

                        obj_map.set(seq.obj, seq);
                    }
                    that.in_delay = Math.max(that.in_delay, parseInt(delay));
                    console.log(that.in_delay)
                }
            } else {
                that.out_duration = Math.max(that.out_duration, parseInt(delay) + parseInt(anim_data_or_duration));
                that.in_delay = Math.max(that.in_delay, parseInt(in_delay));
            }
        }


        start() {

            this.duration = this.in_duration + this.in_delay + this.out_duration;

            if (this.duration > 0)
                this._scheduledUpdate_(0, 0);

            return new Promise((res, rej) => {
                if (this.duration < 1)
                    return res();
                this.res = res;
            });
        }

        _scheduledUpdate_(step, time) {
            this.time += time;

            for (let i = 0; i < this.out_seq.length; i++) {
                let seq = this.out_seq[i];
                seq.run(this.time);
            }

            if (this.time >= this.in_delay) {
                let t = this.time - this.in_delay;
                for (let i = 0; i < this.in_seq.length; i++) {
                    let seq = this.in_seq[i];
                    seq.run(t);
                }
            }

            if (this.time >= this.out_duration && this.res) {
                this.res();
                this.res = null;
            }

            if (this.time < this.duration)
                return Scheduler.queueUpdate(this);

            if (this.res) this.res();
            this._destroy_();
        }
    }

    return {
        createTransition: function() {
            return new Transition();
        }
    };
})();

export { Transitioneer };