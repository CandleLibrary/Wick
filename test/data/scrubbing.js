wick({
    dom: "<w-s element=div class=item component=scrubbing >Test ((data)) ((offset))</w-s>",

    $trs_asc_in: () => {
        trs_asc_in.trs({
            obj: this.ele,
            top: [{
                value: `${150*trs_asc_in.pos.row}px`,
                duration: 200
            }]
        });
    },

    $trs_asc_out: () => {
        trs_asc_out.trs({
            obj: this.ele,
            top: [{
                value: `${150*trs_asc_out.pos.row+1}px`,
                duration: 200
            }]
        });
    },

    $trs_dec_in: () => {
        trs_dec_in.trs({
            obj: this.ele,
            top: [{
                value: `${150*trs_dec_in.pos.row}px`,
                duration: 200
            }]
        });
    },

    $trs_dec_out: () => {
        trs_dec_out.trs({
            obj: this.ele,
            top: [{
                value: `${150*trs_dec_out.pos.row}px`,
                duration: 200
            }]
        });
    },

    $arrange: () => {
        arrange.trs({
            obj: this.ele,
            top: [{
                value: `${150*arrange.pos.row}px`,
                duration: 200
            }]
        });
    }

})

wick({
    dom: `
<w-s element=div component=test onpointerdown=((point)()) style="height:300px">
    <w-c>
        
        <f limit=2 >
        <f offset=((offset)) >
        <f shift=1>
        <f scrub=((scrub)) >
        <f sort=((m1.data<m2.data?-1:1))>

        ((data)) 
        <scrubbing> </scrubbing>
    </w-c>
</w-s>`,

    $mounted: () => {
        this.offset = 0;

        emit.set = null;
        (async ()=>{
            async function pause(time = 1000){
                return new Promise(res=>{
                    setTimeout(res, time)
                })
            };
            const
                amount = 0.25,
                limit = Math.floor(1 / amount);

            for (let i = 0; i < limit; i++) {
                emit.scrub = amount 
                await pause(16); //Pausing for one frame in a 60f/1s mode. 
            }
            emit.scrub = Infinity
            await pause(1000); 
            console.log(src.containers[0].activeSources.map((m,i)=>({ index:i, top: m.sources[0]._top, off:m.sources[0].model.data}))[12])
            //sc.update({ scrub: Infinity })
        })()

    },

    $set: () => {
        let data = [];

        const offset = this.offset;

        for (let i = 0; i < 50; i++) 
            data.push({ data: i + offset, offset: offset + "" });

        emit.offset = 10;
        emit.data = data;
    },

    $template_count_changed: () => {
        let offset = template_count_changed.offset;
        console.log(offset)
        if (offset < 5) {
            //emit("scrub", Infinity);

            //Load new date offset descending

            this.offset -= 6
            emit.set = null
        } //*/

        if (offset > 15) {
            this.offset += 6
            emit.set = null
        }
    },
    $point: () => {
        let root = event.y;

        const
            a = e => {
                const v = -(e.y - root) / 100

                console.log(v)
                emit.scrub = v;
                root = e.y;
            },

            b = e => {
                emit.scrub = Infinity;
                window.removeEventListener("pointermove", a);
                window.removeEventListener("pointerup", b);
            }

        window.addEventListener("pointermove", a);
        window.addEventListener("pointerup", b);
    }
});
