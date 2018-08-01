/**
 * To be extended by objects needing linked list methods.
 * @alias module:wick~internals.LinkedList
 */
export const LinkedList = {

    props: {
        /**
         * Properties for horizontal graph traversal
         * @property {object}
         */
        defaults: {
            /**
             * Next sibling node
             * @property {object | null}
             */
            nxt: null,

            /**
             * Previous sibling node
             * @property {object | null}
             */
            prv: null
        },

        /**
         * Properties for vertical graph traversal
         * @property {object}
         */
        children: {
            /**
             * Number of children nodes.
             * @property {number}
             */
            noc: 0,
            /**
             * First child node
             * @property {object | null}
             */
            fch: null,
        },
        parent: {
            /**
             * Parent node
             * @property {object | null}
             */
            par: null
        }
    },

    methods: {
        /**
         * Default methods for Horizontal traversal
         */
        defaults: {

            next: function() {
                return this.nxt;
            },

            prev: function() {
                return this.prv;
            },

            insertBefore: function(node) {

                if (!this.nxt || !this.prv) {
                    this.nxt = this;
                    this.prv = this;
                }

                if (node.prv || node.nxt) {
                    node.prv.nxt = node.nxt;
                    node.nxt.prv = node.prv;
                }

                node.prv = this.prv;
                this.prv.nxt = node;
                node.nxt = this;
                this.prv = node;
            },

            insertAfter: function(node) {

                if (!this.nxt || !this.prv) {
                    this.nxt = this;
                    this.prv = this;
                }

                if (node.prv || node.nxt) {
                    node.prv.nxt = node.nxt;
                    node.nxt.prv = node.prv;
                }

                this.nxt.prv = node;
                node.nxt = this.nxt;
                this.nxt = node;
                node.prv = this;
            }
        },
        /**
         * Methods for both horizontal and vertical traversal.
         */
        parent_child: {
            /**
             *  Returns eve. 
             * @return     {<type>}  { description_of_the_return_value }
             */
            root(){
                return this.eve();
            },
            /**
             * Returns the root node. 
             * @return     {Object}  return the very first node in the linked list graph.
             */
            eve(){
                if(this.par)
                    return this.par.eve();
                return this;
            },

            push(node) {
                this.addC(node);
            },

            unshift(node) {
                this.addC(node, (this.fch) ? this.fch.pre : null);
            },

            insertBefore: function(node) {
                if (node.par)
                    node.par.remove(node);
                if (this.par)
                    this.par.add(node, this.pre)
                else
                    LinkedList.methods.defaults.insertBefore.call(this, node);
            },

            insertAfter: function(node) {
                if (node.par)
                    node.par.remove(node);
                if (this.par)
                    this.par.add(node, this)
                else 
                	LinkedList.methods.defaults.insertAfter.call(this, node);
            },

            addC: function(child = null, prev = null) {

                if (!child) return;

                if (child.par)
                    child.par.remC(child);

                if (prev && prev.par && prev.par == this) {
                    if (child == prev) return;
                    child.prv = prev.prv;
                    prev.prv.nxt = child;
                    child.nxt = prev;
                    prev.prv = child;
                } else if (this.fch) {
                    child.prv = this.fch.prv;
                    this.fch.prv.nxt = child;
                    child.nxt = this.fch;
                    this.fch.prv = child;
                } else {
                    this.fch = child;
                    child.nxt = child;
                    child.prv = child;
                }

                child.par = this;
                this.noc++;
            },

            /**
             * Analogue to HTMLElement.removeChild()
             *
             * @param      {HTMLNode}  child   The child
             */
            remC: function(child) {
                if (child.par && child.par == this) {
                    child.prv.nxt = child.nxt;
                    child.nxt.prv = child.prv;

                    if (child.prv == child || child.nxt == child) {
                        if (this.fch !== child)
                            debugger
                        this.fch = null;
                    } else if (this.fch == child)
                        this.fch = child.nxt;

                    child.prv = null;
                    child.nxt = null;
                    child.par = null;
                    this.noc--;
                }
            },

            /**
             * Gets the next node. 
             *
             * @param      {HTMLNode}  node    The node to get the sibling of.
             * @return {HTMLNode | TextNode | undefined}
             */
            getN: function(node = this.fch) {
                if (node && node.nxt != this.fch)
                    return node.nxt;
                return null;
            },

            /**
             * Gets the child at index.
             *
             * @param      {number}  index   The index
             */
            getCAtI: function(index, node = this.fch) {
                let first = node;
                let i = 0;
                while (node && node != first) {
                    if (i++ == index)
                        return node;
                    node = node.nxt;
                }
            },
        }
    },

    setGettersAndSetters: (obj) => {
        Object.defineProperties(obj, LL_GS_LIST);
    }
};

const LL_GS_LIST = {
    children: {
        enumerable: true,
        configurable: true,
        /**
         * @return {array} Returns an array of all children.
         */
        get: function() {
            for (var z = [], i = 0, node = this.fch; i++ < this.noc;)(
                z.push(node), node = node.nxt
            );
            return z;
        },

        set: function(e) {
            /* No OP */
        }
    }
};