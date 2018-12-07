import { VoidNode } from "./void";

export class PackageNode extends VoidNode {

    constructor(start) {
        super();
        this._start_ = start;
    }

    /******************************************* HOOKS ****************************************************/

    /**
     * Binds new laxer to boundaries starting from open tag to close tag. Applies Lexer to new SourcePackage.
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

        this.par._package_ = new this.SourcePackage(own_lex, this.presets, false);

        if (!this.fch)
            this.mergeComponent();
    }

    mergeComponent() {
        let component = this.presets.components[this.tag];

        if (component)
            this.par._package_ = new this.SourcePackage(component, this.presets, false);
    }
}