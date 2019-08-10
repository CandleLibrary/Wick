import wick from "/home/anthony/work/active/apps/cfw/wick/source/wick.js";

class Scrubbing extends wick{
    
    constructor(p){super("<scope element=div class=item>Test ((data)) ((offset))</scope>", p)}

    loaded() {
        this._top = 0;
    }

    trs_asc_in () {
        trs({
            obj: this,
            _top: [
                {
                    value: 150*pos.row,
                    duration: 200
                }
            ]
        });
    }

    trs_asc_out () {
        trs({
            obj: this,
            _top: [
                {
                    value: 150*pos.row+1,
                    duration: 200
                }
            ]
        });
    }

    trs_dec_in () {
        trs({
            obj: this,
            _top: [
                {
                    value: 150*pos.row,
                    duration: 200
                }
            ]
        });
    }

    trs_dec_out () {
        trs({
            obj: this,
            _top: [
                {
                    value: 150*pos.row,
                    duration: 200
                }
            ]
        });
    }

    arrange () {
        trs({
            obj: this,
            _top: [
                {
                    value: 150*pos.row,
                    duration: 200
                }
            ]
        });
    }
}

export default class extends wick {
    constructor(presets) {
        
        new Scrubbing(presets);

        super(`<scope element=div component=test style="height:300px" import="template_count_changed">
                <container>
                    <f limit="2" >
                    <f offset=((offset)) >
                    <f shift="1">
                    <f scrub=((scrub)) >
                    <f sort=((m1.data<m2.data?-1:1))>
                    ((data)) 
                    <Scrubbing/>
                </container>
            </scope>`, presets);

    }

    mounted() {
        this.offset = 0;
        seta = true;
    }

    seta() {
        let d = [];

        const off = this.offset;

        for (let i = 0; i < 50; i++)
            d.push({ data: i + off, offset: off + "" });

        offset = 10;
        data = d;
    }

    template_count_changed() {
        if (offset < 5) {
            this.offset -= 6;
            seta.emit();
        }

        if (offset > 15) {
            this.offset += 6;
            seta.emit();
        }
    }

    point() {
        let root = event.y;

        const
            a = e => {
                const v = -(e.y - root) / 100;
                scrub = v;
                root = e.y;
            },

            b = e => {
                scrub = Infinity;
                window.removeEventListener("pointermove", a);
                window.removeEventListener("pointerup", b);
            };

        window.addEventListener("pointermove", a);
        window.addEventListener("pointerup", b);
    }
}
