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
    _processTextNodeHook_(lex) {

        let own_lex = lex.copy();

        let pk = own_lex.pk;

        own_lex.tl = 0;

        own_lex.off = this._start_;

        own_lex.n().sl = own_lex.str.length;

        while (!pk.n().END && (pk.ch !== "<" || pk.n().ch !== "/" || pk.n().tx !== this.tag || pk.n().ch !== ">"));

        own_lex.sl = pk.off + pk.tl;

        this.par._package_ = new this.SourcePackage(own_lex, this._presets_, false);
    }

    _ignoreTillHook_() { return true; }

    _endOfElementHook_() {
        if (!this.fch)
            this._mergeComponent_();
    }

    _mergeComponent_() {
        let component = this._presets_.components[this.tag];

        if (component)
            this.par._package_ = new this.SourcePackage(component, this._presets_, false);
    }
}