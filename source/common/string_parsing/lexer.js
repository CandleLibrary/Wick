var  null_token = {
    type: "",
    text: ""
};

class Lexer {
    constructor(tokenizer) {
        this.tk = tokenizer;

        this.token = tokenizer.next();

        this.hold = null;

        while (this.token && (this.token.type === "new_line" || this.token.type === "white_space" || this.token.type === "generic")) {
            this.token = this.tk.next();
        }
    }

    next() {
        if (this.hold !== null) {
            this.token = this.hold;
            this.hold = null;
            return this.token;
        }

        if (!this.token) return null;
        do {
            this.token = this.tk.next();
        } while (this.token && (this.token.type === "new_line" || this.token.type === "white_space" || this.token.type === "generic"));

        if (this.token) {
            return this.token;
        }
        return null;
    }

    assert(text) {
        if (!this.token) return false;

        var bool = this.token.text == text;

        if (bool) {
            this.next();
        }

        return bool;
    }

    peek() {
        if (this.hold) {
            return this.hold;
        }

        this.hold = this.tk.next();

        if (!this.hold) return null_token;

        while (this.hold && (this.hold.type === "new_line" || this.hold.type === "white_space" || this.hold.type === "generic")) {
            this.hold = this.tk.next();
        }

        if (this.hold) {
            return this.hold;
        }

        return null_token;
    }
}

export {Lexer}