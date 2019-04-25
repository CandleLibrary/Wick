export default [{
    s: "mocha.chai.jsdom",
    l: ["wick", "wick.node", "url", "pause"],
    g: 'wick.element.merging',
    d: "Merging elements pulls statics from the merged-from tag",
    t: async () => {
        let presets = wick.presets();
        await wick(`<w-s component="mergedto" #temp=false >test<w-s>`, presets);
        let comp = await wick(`<div><mergedto #temp=true>test false</mergedto></div>`, presets);
        let ele = document.createElement("div");
        let component = comp.mount(ele);

        component.sources[0].sources[0].statics.should.have.property("temp", "true");
    }
}, {
    d: "Merging pulls attribute data from both merging-component and merged-element. Merged elements attributes are preferred",
    t: async () => {
        let presets = wick.presets();
        await wick(`<w-s element="div" component="mergedto" temp="false" foo="biz">test<w-s>`, presets);
        let comp = await wick(`<div><mergedto temp="true" bar="buz">test false</mergedto></div>`, presets);
        let ele = document.createElement("div");
        let component = comp.mount(ele);
        let sub_ele = ele.firstChild.firstChild;
        sub_ele.getAttribute("temp").should.equal("true");
        sub_ele.getAttribute("foo").should.equal("biz");
        sub_ele.getAttribute("bar").should.equal("buz");
    }
}]
