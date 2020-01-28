import glow from "@candlefw/glow";
import spark from "@candlefw/spark";

function createComponent(){

}

function getColumnRow(index, offset, set_size) {
	const adjusted_index = index - offset * set_size;
	const row = Math.floor(adjusted_index / set_size);
	const col = (index) % (set_size);
	return { row, col };
}

/* Update container scopes. */
export function ctr_upd(ctr, data_objs) {
	if (!data_objs) return;

	if (data_objs.observering) {
		if (ctr.observering.removeObserver)
			ctr.observering.removeObserver(ctr);
		ctr.observering = null;
	}

	if (data_objs.addObserver) {
		ctr.observering = data_objs;
		data_objs.addObserver(ctr);
		return;
	}

	if (Array.isArray(data_objs)) cull(ctr, data_objs);
	else cull(ctr, data_objs.data);
}

/* Update container filters. */
export function ctr_fltr(ctr, type, val) {
	switch (type) {
		case "fl":
			break;
	}
	filterUpdate(ctr);
	limitExpressionUpdate(ctr);
}

/* Create a wick container */
export function ctr(ele, component, ...filters) {

	const ctr = {
		component: { mount: (ele, data) => createComponent(component, data) },
		ele,
		SCRUBBING: false,
		scopes: [],
		active_scopes: [],
		dom_scopes: [],
		filters,
		scrub_velocity: 0,
		shift_amount: 1,
		limit: 0,
		offset: 0,
		offset_diff: 0,

		offset_fractional: 0,
		scheduledUpdate() {
			if (ctr.SCRUBBING) {

				if (!ctr.AUTO_SCRUB) { return (ctr.SCRUBBING = false) }

				if (Math.abs(ctr.scrub_velocity) > 0.0001) {
					if (scrub(ctr, ctr.scrub_velocity)) {

						ctr.scrub_velocity *= (ctr.drag);

						const pos = ctr.offset + ctr.scrub_velocity;

						if (pos < 0 || pos > ctr.max)
							ctr.scrub_velocity = 0;

						spark.queueUpdate(ctr);
					}

				} else {
					ctr.scrub_velocity = 0;
					scrub(ctr, Infinity);
					ctr.SCRUBBING = false;
				}
			} else {
				forceMount(ctr);
				arrange(ctr);
				render(ctr);
				ctr.offset_diff = 0;
			}
		}
	};

	return ctr;
}

export function cull(ctr, new_items = []) {
	const transition = glow.createTransition();

	if (new_items.length == 0) {

		const sl = ctr.scopes.length;

		for (let i = 0; i < sl; i++) ctr.scopes[i].transitionOut(transition, "", true);

		ctr.scopes.length = 0;
		ctr.active_scopes.length = 0;
		/*
		ctr.parent.upImport("template_count_changed", {
			displayed: 0,
			offset: 0,
			count: 0,
			pages: 0,
			ele: ctr.ele,
			template: ctr,
			trs: transition.in
		});
		*/

		if (!ctr.SCRUBBING)
			transition.start();

	} else {

		const
			exists = new Map(new_items.map(e => [e, true])),
			out = [];

		for (let i = 0, l = ctr.active_scopes.length; i < l; i++)
			if (exists.has(ctr.active_scopes[i].model))
				exists.set(ctr.active_scopes[i].model, false);


		for (let i = 0, l = ctr.scopes.length; i < l; i++)
			if (!exists.has(ctr.scopes[i].model)) {
				ctr.scopes[i].transitionOut(transition, "dismounting", true);
				ctr.scopes[i].index = -1;
				ctr.scopes.splice(i, 1);
				l--;
				i--;
			} else
				exists.set(ctr.scopes[i].model, false);

		exists.forEach((v, k) => { if (v) out.push(k); });

		if (out.length > 0) {
			// Wrap models into components
			added(ctr, out, transition);

		} else {
			for (let i = 0, j = 0, l = ctr.active_scopes.length; i < l; i++, j++) {

				if (ctr.active_scopes[i]._TRANSITION_STATE_) {
					if (j !== i) {
						ctr.active_scopes[i].update({
							arrange: {
								pos: getColumnRow(i, ctr.offset, ctr.shift_amount),
								trs: transition.in
							}
						});
					}
				} else
					ctr.active_scopes.splice(i, 1), i--, l--;
			}
		}

		filterUpdate(ctr);
		limitExpressionUpdate(ctr, transition);
	}
}

export function filterUpdate(ctr) {

	let output = ctr.scopes.slice();

	if (output.length < 1) return;

	for (let i = 0, l = ctr.filters.length; i < l; i++) {
		const filter = ctr.filters[i];
		//if(filter.active){
		switch (filter.type) {
			case "sort":
				output = output.sort(filter.action);
			case "filter":
				output = output.filter(filter.action);
		}
		//}
	}

	ctr.active_scopes = output;

	ctr.UPDATE_FILTER = false;

	return output;
}

export function limitExpressionUpdate(ctr, transition = glow.createTransition()) {

	//Preset the positions of initial components. 
	arrange(ctr);
	render(ctr, transition);

	// If scrubbing is currently occuring, if the transition were to auto play then the results 
	// would interfere with the expected behavior of scrubbing. So the transition
	// is instead set to it's end state, and scrub is called to set intermittent 
	// position. 
	if (!ctr.SCRUBBING)
		transition.start();
}

function arrange(ctr, output = ctr.active_scopes) {

	//Arranges active scopes according to their arrange handler.
	const
		limit = ctr.limit,
		offset = ctr.offset,
		transition = glow.createTransition(),
		output_length = output.length,
		active_window_start = offset * ctr.shift_amount;



	let i = 0;

	//Scopes on the ascending edge of the transition window
	while (i < active_window_start && i < output_length)
		output[i].update({ trs_asc_out: { trs: transition.in, pos: getColumnRow(i, offset, ctr.shift_amount) } }), i++;

	//Scopes in the transtion window
	while (i < active_window_start + limit && i < output_length)
		output[i].update({ arrange: { trs: transition.in, pos: getColumnRow(i, offset, ctr.shift_amount) } }), i++;

	//Scopes on the descending edge of the transition window
	while (i < output_length)
		output[i].update({ trs_dec_out: { trs: transition.in, pos: getColumnRow(i, offset, ctr.shift_amount) } }), i++;

	transition.play(1);

}


function render(ctr, transition, output = ctr.active_scopes, NO_TRANSITION = false) {


	const
		active_window_size = ctr.limit,
		active_length = ctr.dom_scopes.length;

	let
		j = 0,
		direction = 1,
		offset = ctr.offset,
		output_length = output.length,
		OWN_TRANSITION = false;

	if (!transition) transition = glow.createTransition(), OWN_TRANSITION = true;

	offset = Math.max(0, offset);

	const active_window_start = offset * ctr.shift_amount;

	direction = Math.sign(ctr.offset_diff);

	if (active_window_size > 0) {

		ctr.shift_amount = Math.max(1, Math.min(active_window_size, ctr.shift_amount));

		let
			i = 0,
			oa = 0;

		const
			ein = [],
			shift_points = Math.ceil(output_length / ctr.shift_amount);

		ctr.max = shift_points - 1;
		ctr.offset = Math.max(0, Math.min(shift_points - 1, offset));

		//Two transitions to support scrubbing from an offset in either direction
		ctr.trs_ascending = glow.createTransition(false);
		ctr.trs_descending = glow.createTransition(false);

		ctr.dom_dn.length = 0;
		ctr.dom_up.length = 0;
		ctr.dom_up_appended = false;
		ctr.dom_dn_appended = false;

		//Scopes preceeding the transition window
		while (i < active_window_start - ctr.shift_amount) output[i++].index = -2;

		//Scopes entering the transition window ascending
		while (i < active_window_start) {
			ctr.dom_dn.push(output[i]);
			output[i].update({ trs_dec_in: { trs: ctr.trs_descending.in, pos: getColumnRow(i, ctr.offset - 1, ctr.shift_amount) } });
			output[i++].index = -2;
		}

		//Scopes in the transition window
		while (i < active_window_start + active_window_size && i < output_length) {
			//Scopes on the descending edge of the transition window
			if (oa < ctr.shift_amount && ++oa) {
				//console.log("pos",i, getColumnRow(i, ctr.offset+1, ctr.shift_amount), output[i].scopes[0].ele.style.transform)
				output[i].update({ trs_asc_out: { trs: ctr.trs_ascending.out, pos: getColumnRow(i, ctr.offset + 1, ctr.shift_amount) } });
			} else
				output[i].update({ arrange: { trs: ctr.trs_ascending.in, pos: getColumnRow(i, ctr.offset + 1, ctr.shift_amount) } });


			//Scopes on the ascending edge of the transition window
			if (i >= active_window_start + active_window_size - ctr.shift_amount)
				output[i].update({ trs_dec_out: { trs: ctr.trs_descending.out, pos: getColumnRow(i, ctr.offset - 1, ctr.shift_amount) } });
			else
				output[i].update({ arrange: { trs: ctr.trs_descending.in, pos: getColumnRow(i, ctr.offset - 1, ctr.shift_amount) } });


			output[i].index = i;
			ein.push(output[i++]);
		}

		//Scopes entering the transition window while offset is descending
		while (i < active_window_start + active_window_size + ctr.shift_amount && i < output_length) {
			ctr.dom_up.push(output[i]);
			output[i].update({
				trs_asc_in: {
					pos: getColumnRow(i, ctr.offset + 1, ctr.shift_amount),
					trs: ctr.trs_ascending.in
				}
			});
			output[i++].index = -3;
		}

		//Scopes following the transition window
		while (i < output_length) output[i++].index = -3;

		output = ein;
		output_length = ein.length;
	} else {
		ctr.max = 0;
		ctr.limit = 0;
	}

	const
		trs_in = { trs: transition.in, index: 0 },
		trs_out = { trs: transition.out, index: 0 };

	for (let i = 0; i < output_length; i++) output[i].index = i;

	for (let i = 0; i < active_length; i++) {

		const as = ctr.dom_scopes[i];

		if (as.index > j) {
			while (j < as.index && j < output_length) {
				const os = output[j];
				os.index = -1;
				trs_in.pos = getColumnRow(j, ctr.offset, ctr.shift_amount);

				os.appendToDOM(ctr.ele, as.ele);
				os.transitionIn(trs_in, (direction) ? "trs_asc_in" : "trs_dec_in");
				j++;
			}
		} else if (as.index < 0) {

			trs_out.pos = getColumnRow(i, 0, ctr.shift_amount);

			if (!NO_TRANSITION) {
				switch (as.index) {
					case -2:
					case -3:
						as.transitionOut(trs_out, (direction > 0) ? "trs_asc_out" : "trs_dec_out");
						break;
					default:
						as.transitionOut(trs_out);
				}
			} else
				as.transitionOut();

			continue;
		}
		trs_in.pos = getColumnRow(j++, 0, ctr.shift_amount);

		as.update({ arrange: trs_in }, null, false, { IMMEDIATE: true });

		as._TRANSITION_STATE_ = true;
		as.index = -1;
	}

	while (j < output.length) {
		output[j].appendToDOM(ctr.ele);
		output[j].index = -1;
		trs_in.pos = getColumnRow(j, ctr.offset, ctr.shift_amount);
		output[j].transitionIn(trs_in, (direction) ? "arrange" : "arrange");
		j++;
	}

	ctr.ele.style.position = ctr.ele.style.position;
	ctr.dom_scopes = output.slice();

	/*
	ctr.parent.update({
		"template_count_changed": {

			displayed: output_length,
			offset: offset,
			count: ctr.active_scopes.length,
			pages: ctr.max,
			ele: ctr.ele,
			template: ctr,
			trs: transition.in
		}
	});
	//*/

	if (OWN_TRANSITION) {
		if (NO_TRANSITION)
			return transition;
		transition.start();
	}

	return transition;
}

function forceMount(ctr) {
	const active_window_size = ctr.limit;
	const offset = ctr.offset;


	const min = Math.min(offset + ctr.offset_diff, offset) * ctr.shift_amount;
	const max = Math.max(offset + ctr.offset_diff, offset) * ctr.shift_amount + active_window_size;


	let i = min;

	ctr.ele.innerHTML = "";
	const output_length = ctr.active_scopes.length;
	ctr.dom_scopes.length = 0;

	while (i < max && i < output_length) {
		const node = ctr.active_scopes[i++];
		ctr.dom_scopes.push(node);
		ctr.ele.appendChild(node.ele);
	}
}

/**
 * Scrub provides a mechanism to scroll through components of a container that have been limited through the limit filter.
 * @param  {Number} scrub_amount [description]
 */
function scrub(ctr, scrub_delta, SCRUBBING = true) {
	// scrub_delta is the relative ammunt of change from the previous offset. 

	if (!ctr.SCRUBBING)
		render(ctr, null, ctr.active_scopes, true);

	ctr.SCRUBBING = true;

	if (ctr.AUTO_SCRUB && !SCRUBBING && scrub_delta != Infinity) {
		ctr.scrub_velocity = 0;
		ctr.AUTO_SCRUB = false;
	}

	let delta_offset = scrub_delta + ctr.offset_fractional;

	if (scrub_delta !== Infinity) {

		if (Math.abs(delta_offset) > 1) {
			if (delta_offset > 1) {

				delta_offset = delta_offset % 1;
				ctr.offset_fractional = delta_offset;
				ctr.scrub_velocity = scrub_delta;

				if (ctr.offset < ctr.max)
					ctr.trs_ascending.play(1);

				ctr.offset++;
				ctr.offset_diff = 1;
				render(ctr, null, ctr.active_scopes, true).play(1);
			} else {
				delta_offset = delta_offset % 1;
				ctr.offset_fractional = delta_offset;
				ctr.scrub_velocity = scrub_delta;

				if (ctr.offset >= 1)
					ctr.trs_descending.play(1);
				ctr.offset--;
				ctr.offset_diff = -1;

				render(ctr, null, ctr.active_scopes, true).play(1);
			}

		}

		//Make Sure the the transition animation is completed before moving on to new animation sequences.

		if (delta_offset > 0) {

			if (ctr.offset + delta_offset >= ctr.max - 1) delta_offset = 0;

			if (!ctr.dom_up_appended) {

				for (let i = 0; i < ctr.dom_up.length; i++) {
					ctr.dom_up[i].appendToDOM(ctr.ele);
					ctr.dom_up[i].index = -1;
					ctr.dom_scopes.push(ctr.dom_up[i]);
				}

				ctr.dom_up_appended = true;
			}

			ctr.trs_ascending.play(delta_offset);
		} else {

			if (ctr.offset < 1) delta_offset = 0;

			if (!ctr.dom_dn_appended) {

				for (let i = 0; i < ctr.dom_dn.length; i++) {
					ctr.dom_dn[i].appendToDOM(ctr.ele, ctr.dom_scopes[0].ele);
					ctr.dom_dn[i].index = -1;
				}

				ctr.dom_scopes = ctr.dom_dn.concat(ctr.dom_scopes);

				ctr.dom_dn_appended = true;
			}

			ctr.trs_descending.play(-delta_offset);
		}

		ctr.offset_fractional = delta_offset;
		ctr.scrub_velocity = scrub_delta;

		return true;
	} else {

		if (Math.abs(ctr.scrub_velocity) > 0.0001) {
			const sign = Math.sign(ctr.scrub_velocity);

			if (Math.abs(ctr.scrub_velocity) < 0.1) ctr.scrub_velocity = 0.1 * sign;
			if (Math.abs(ctr.scrub_velocity) > 0.5) ctr.scrub_velocity = 0.5 * sign;

			ctr.AUTO_SCRUB = true;

			//Determine the distance traveled with normal drag decay of 0.5
			let dist = ctr.scrub_velocity * (1 / (-0.5 + 1));
			//get the distance to nearest page given the distance traveled
			let nearest = (ctr.offset + ctr.offset_fractional + dist);
			nearest = (ctr.scrub_velocity > 0) ? Math.min(ctr.max, Math.ceil(nearest)) : Math.max(0, Math.floor(nearest));
			//get the ratio of the distance from the current position and distance to the nearest 
			let nearest_dist = nearest - (ctr.offset + ctr.offset_fractional);
			let drag = Math.abs(1 - (1 / (nearest_dist / ctr.scrub_velocity)));

			ctr.drag = drag;
			ctr.SCRUBBING = true;
			spark.queueUpdate(ctr);
			return true;
		} else {
			ctr.offset += Math.round(ctr.offset_fractional);
			ctr.scrub_velocity = 0;
			ctr.offset_fractional = 0;
			render(ctr, null, ctr.active_scopes, true).play(1);
			ctr.SCRUBBING = false;
			return false;
		}
	}
}

/**
 * Called by the ModelContainer when Models have been added to its set.
 *
 * @param      {Array}  items   An array of new items now stored in the ModelContainer. 
 */
function added(ctr, items, transition) {
	let OWN_TRANSITION = false;

	if (!transition)
		transition = glow.createTransition(), OWN_TRANSITION = true;

	for (let i = 0; i < items.length; i++) {
		const scope = ctr.component.mount(null, items[i]);

		//TODO: Make sure both of there references are removed when the scope is destroyed.
		ctr.scopes.push(scope);
		//ctr.parent.addScope(scope);

		scope.update({ loaded: true });
	}



	if (OWN_TRANSITION)
		filterExpressionUpdate(ctr, transition);
}