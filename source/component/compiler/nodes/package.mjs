import { VoidNode } from "./void";

export class PackageNode extends VoidNode {

    constructor(start) {
        super();
        this._start_ = start;
        this.url = this.getURL();
        this.tag = "package";
    }

    /******************************************* HOOKS ****************************************************/

    /**
     * Binds new laxer to boundaries starting from open tag to close tag. Applies Lexer to new ScopePackage.
     * @param      {Lexer}  lex     The lex
     * @private
     */
    processTextNodeHook(lex) {}

    _ignoreTillHook_() { return true; }

    endOfElementHook(lex) {
        let own_lex = lex.copy();

        own_lex.off = this._start_;
        own_lex.tl = 0;
        own_lex.n.sl = lex.off;
        
        this.par.package = new this.ScopePackage(own_lex, this.presets, false);

        if (!this.fch)
            this.mergeComponent();

        return this;
    }

    mergeComponent() {
        
        let component = this.presets.components[this.tag];

        if (component)
            this.par.package = new this.ScopePackage(component, this.presets, false);

        return component
    }
}
