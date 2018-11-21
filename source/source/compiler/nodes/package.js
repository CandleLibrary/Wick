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
    _processTextNodeHook_(lex) {}

    _ignoreTillHook_() { return true; }

    _endOfElementHook_(lex) {
        let own_lex = lex.copy();

        own_lex.off = this._start_;
        own_lex.tl = 0;
        own_lex.n().sl = lex.off;

        this.par._package_ = new this.SourcePackage(own_lex, this._presets_, false);

        if (!this.fch)
            this._mergeComponent_();
    }

    _mergeComponent_() {
        let component = this._presets_.components[this.tag];

        if (component)
            this.par._package_ = new this.SourcePackage(component, this._presets_, false);
    }
}