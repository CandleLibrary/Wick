import {
	StyleMappings
} from "./style_mappings"
import {TransformTo} from "./transformto"


export {TransformTo}

class StyleAnimBloc {
	
	constructor(style, to_val, duration, delay) {
		this.style = style;
		this.delay = delay;
		this.duration = duration;
		this.to_val = to_val;
		this.step = 0;
		this.next = null;
		this.prev = null;
	}

	destroy() {

	}

	step(step_multiplier) {

	}
}

class AnimBuddy {
	constructor(element) {
		this.style = window.getComputedStyle(element, null);
		this.first_animation = null;
	}

	setAnimation(vals) {
		let anim_bloc = null;
		if (vals instanceof Array) {

		} else {

		}
		if(anim_bloc){
			this.__insert__(ab);
		}
	}

	__insert__(ab) {
		let bloc = this.first_animation;

		while (bloc) {
			if (bloc.style = ab.style) {
				ab.destroy();
				return;
			}
		}

		ab.next = this.first_animation;
		if (this.first_animation)
			this.first_animation.prev = ab;
		this.first_animation = ab;
	}

	step(step_multiplier) {
		var anim_bloc = this.first_animation;
		if (anim_bloc)
			while (anim_bloc)
				if (!anim_bloc.step(step_multiplier)) {
					if (!anim_bloc.prev)
						this.first_animation = anim_bloc.next;
					else
						anim_bloc.prev.next = anim_bloc.next;
					if (anim_bloc.next)
						anim_bloc.next.prev = anim_bloc.prev;

					let next = anim_bloc.next;

					anim_bloc.destroy();

					anim_bloc = next;
				}
		else
			anim_bloc = anim_bloc.next;


		return false;
	}

	destroy() {

	}

	getStyle() {
		return
	}

	setStyle(value) {

	}

	onResize() {
		this.getStyle()
	}
}

export class AnimCore{
	constructor() {
		this.anim_group = {};
		this.running_animations = [];
	}

	step(step_multiplier) {
		var l = this.running_animations.lenght;
		if (l > 0) {
			for (var i = 0; i < l; i++) {

				var ab = this.running_animations[i];

				if (ab && !ab.step(step_multiplier)) {
					ab.destroy();
					this.running_animations[i] = null;
				}
			}
		}
	}

	addBloc(anim_bloc) {
		if (anim_bloc instanceof AnimBloc) {
			//add to group of object

		}
	}
}