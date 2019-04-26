

wick({
    dom: "<w-s element=div class=item component=scrubbing >Test ((data)) </w-s>",
    
    $trs_asc_in: () => {
        trs_asc_in.trs({
            obj: this.ele,
            top: [
                {
                    value: `${150*trs_asc_in.pos.row}px`,
                    duration: 200
                }
            ]
        });
    },

    $trs_asc_out: () => {
        trs_asc_out.trs({
            obj: this.ele,
            top: [
                {
                    value: `${150*trs_asc_out.pos.row+1}px`,
                    duration: 200
                }
            ]
        });
    },

    $trs_dec_in: () => {
        trs_dec_in.trs({
            obj: this.ele,
            top: [
                {
                    value: `${150*trs_dec_in.pos.row}px`,
                    duration: 200
                }
            ]
        });
    },

    $trs_dec_out: () => {
        trs_dec_out.trs({
            obj: this.ele,
            top: [
                {
                    value: `${150*trs_dec_out.pos.row}px`,
                    duration: 200
                }
            ]
        });
    },

    $arrange: () => {
        arrange.trs({
            obj: this.ele,
            top: [
                {
                    value: `${150*arrange.pos.row}px`,
                    duration: 200
                }
            ]
        });
    }

})

wick({
    dom: `
<w-s element=div component=test onpointerdown=((point)()) style="height:300px">
    <w-c>
        
        <f limit=2 >
        <f offset=((offset)(1)) >
        <f shift=1>
        <f scrub=((scrub)) >
        <f sort=((m1.data<m2.data?-1:1))>

        ((data)) 
        <scrubbing> </scrubbing>
    </w-c>
</w-s>`,

    $mounted: () => {
        this.data = [{ data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }, { data: 5 }, { data: 6 }, { data: 7 }, { data: 8 }];
        emit.data = this.data;
    },

    $template_count_changed: () => {
        
    },

    $point:()=>{
        let root = event.y; 

        const 
            a = e =>{
                const v =-(e.y - root)/100
                emit.scrub = v;
                root = e.y;
            },

            b = e => {
                emit.scrub = Infinity;
                window.removeEventListener("pointermove", a)
                window.removeEventListener("pointerup", b)
            }

        window.addEventListener("pointermove", a)
        window.addEventListener("pointerup", b)
    }
});