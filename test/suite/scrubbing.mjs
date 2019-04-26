export default [{
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
    },
    {
        d: "Jumping to random points keep components in expected places.",
        t: async () => {
            let component = await wick("/test/data/scrubbing.js", wick.presets());
            let ele = document.createElement("div");
            let mgr = component.mount(ele, { data: [{ data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }, { data: 5 }, { data: 6 }, { data: 7 }, { data: 8 }] });
            const container = mgr.sources[0].containers[0];

            //Start a prefixed place
            mgr.update({ offset: 4 })


        }
    },
    {
        d: "Jumping to random points keep components in expected places.",
        t: null
    }
]