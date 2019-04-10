export default [{
    s: "mocha.chai.jsdom",
    l: ["wick", "wick.node", "url", "pause"],
    g: 'wick.container.scrubbing',
    d: "Allows scrubbing of elements within a container",
    t: async function() {
    	this.slow(5000);
    	this.timeout(12000);

        let presets = wick.presets();

        await wick({
            dom: "<w-s component=\"scrubbing\">Test((data))</w-s>",
            $trs_in_up: () => {
            	if(typeof(this.test_value) == "undefined")
            		this.test_value = 0;
                trs_in_up.trs({
                    obj: this,
                    test_value: [
                        { value: -50 },
                        {
                            value: 0,
                            duration: 20
                        }
                    ]
                });
            },
            $trs_in_dn: () => {
            	if(typeof(this.test_value) == "undefined")
            		this.test_value = 0;
                trs_in_dn.trs({
                    obj: this,
                    test_value: [
                        { value: 50 },
                        {
                            value: 0,
                            duration: 20
                        }
                    ]
                });
            },
            $trs_out_up: () => {
            	if(typeof(this.test_value) == "undefined")
            		this.test_value = 0;
                trs_out_up.trs({
                    obj: this,
                    test_value: [
                        { value: 0 },
                        {
                            value: 50,
                            duration: 20
                        }
                    ]
                });
            },
            $trs_out_dn: () => {
            	if(typeof(this.test_value) == "undefined")
            		this.test_value = 0;
                trs_out_dn.trs({
                    obj: this,
                    test_value: [
                        { value: 0 },
                        {
                            value: -50,
                            duration: 20
                        }
                    ]
                });
            }
        }, presets)

        let component = (await wick({
            dom: ` <w-s component="test">
    <w-c>
        ((data)) 
        <f limit="1">
        <f offset="1">
        <f shift="1">
        <f sort=((m1.data < m2.data ? -1 : 1))>
        <scrubbing> </scrubbing>
    </w-c>
</w-s>`
        }, presets));

        let ele = document.createElement("div");
        let mgr = component.mount(ele, { data: [{ data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }, { data: 5 }, { data: 6 }, { data: 7 }, { data: 8 }] });
        const container = mgr.sources[0].containers[0];
 
        console.log(container.activeSources.map(e=>e.sources[0].test_value))
        await pause(120)
        
        container.offset.should.equal(1);
        (container.activeSources.map(e=>e.sources[0].test_value))[1].should.equal(0);

        
        console.log(container.offset, container.offset_fractional, container.activeSources.map(e=>e.sources[0].test_value))
        container.scrub(-0.5)
        pause(50)
        console.log(container.offset, container.offset_fractional, container.activeSources.map(e=>e.sources[0].test_value))
        container.scrub(-0.48)
        pause(50)
        console.log(container.offset, container.offset_fractional, container.activeSources.map(e=>e.sources[0].test_value))


    }
}]
