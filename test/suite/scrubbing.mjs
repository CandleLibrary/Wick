export default [/*{
        s: "mocha.chai.jsdom",
        l: ["wick", "wick.node", "url", "pause"],
        g: 'wick.container.scrubbing',
        d: "Allows scrubbing of elements within a container",
        t: async function() {

            this.slow(5000);
            this.timeout(12000);
            let component = await wick("/test/data/scrubbing.js", wick.presets());

            let ele = document.createElement("div");
            let mgr = component.mount(ele, { data: [{ data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }, { data: 5 }, { data: 6 }, { data: 7 }, { data: 8 }] });
            const container = mgr.sources[0].containers[0];
            await pause(120)

            container.offset.should.equal(1);
            (container.activeSources.map(e => e.sources[0].test_value))[1].should.equal(0);


            console.log(container.offset, container.offset_fractional, container.activeSources.map(e => e.sources[0].test_value))
            container.scrub(-0.5)
            pause(50)
            console.log(container.offset, container.offset_fractional, container.activeSources.map(e => e.sources[0].test_value))
            container.scrub(-0.48)
            pause(50)
            console.log(container.offset, container.offset_fractional, container.activeSources.map(e => e.sources[0].test_value))
        }
    },*/
    {   s: "mocha.chai.jsdom",
        l: ["wick", "wick.node", "url", "pause"],
        g: 'wick.container.scrubbing',
        d: "Introducing new offset and set of elements does not visually change elements order.",
        t: async function () {
            this.slow(200000)
            this.timeout(10000)

            const 
                component = await wick("/test/data/scrubbing2.js", wick.presets()),
                ele = document.createElement("div"),
                mgr = component.mount(ele),
                src = mgr.sources[0],
                sc = src.containers[0];
                await pause(16);
                //Add incremental scrubs that add up to 5
                const 
                    amount = 0.05, 
                    limit = Math.floor(6.5 / amount);

                for(let i = 0; i < limit; i++){
                    src.update({scrub:amount})
                    await pause(5); //Pausing for one frame in a 60f/1s mode. 
                }

                src.update({scrub:Infinity})

                await pause(200)


                sc.activeSources.map((m,i)=>({ index:i, top: m.sources[0]._top, off:m.sources[0].model.data}))[11].off.should.equal(17);

             
        }
    },
    {
        d: "Jumping to random points keep components in expected places.",
        t: null
    }
]
