export default [{
    s: "mocha.chai.jsdom",
    l: ["wick", "wick.node", "url", "pause"],
    g: 'wick.element.merging',
    d: "Merging elements pulls statics from the merged-from tag",
    t: async()=>{
        let presets = wick.presets();
        await wick(`<w-s component="mergedto" #temp=false >test<w-s>`, presets);
        let comp = await wick(`<div><mergedto #temp=true>test false</mergedto></div>`, presets);
        let ele = document.createElement("div");
        let component = comp.mount(ele);
        
        component.sources[0].sources[0].statics.should.have.property("temp", "true");
    }
}]
