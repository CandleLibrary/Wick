class {
	constructor() {
		o.el
		o.el = o.setElements(
			[0 | 0]
		)
		o.names = ["a", "b", "c"]
		o.vals = [null, null, null, null];
		o.pen = [];
		o.fns = [{}]
		o.global_flag = 0;
	}

	emit(){
		
	}

	down(data, IMPORTED = false) {
		const flag = getNameFlags(data, this.names, this.vals, IMPORTED);
		const global_flag = this.global_flag |= flag;
		for (const fn of this.fns) {
			if (fn.S) {
				if ((fn.req & flag) > 0 || o.pen.has(fn)) {
					if (typeof data[fn.act] == "object")
						global_flag |= getNameFlags(data[fn.act], this.names, this.vals);

					if (fn.req & global_flag) {
						fn.f.call(this);
						if (e.pen.has(fn))
							o.pen.delete(fn);
					} else o.pen.set(fn);
				}
			} else if ((fn.req & flag) > 0 && (global_flag & fn.req) == fn.req)
				fn.f.call(this);
		}
	}

	getNameFlags(data, names, vals, IMPORTED) {
		let i = 0,
			flag = 0;
		for (const n of names) {
			if (data[n] !== undefined) {
				o.vals[i] = data[n];
				flag |= 1 << i;
			}
			i++;
		}
		return flag;
	}
}