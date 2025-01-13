export class StateNode {
    public type: string;
    public parent: StateNode | null;
    public children: StateNode[];
    public text?: string;

    constructor(
        type: string,
        parent: StateNode | null = null
    ) {
        this.type = type;
        this.parent = parent;
        this.children = [];
    }

    appendNode(node: StateNode) {
        this.children.push(node);
    }

    setText(text: string, index: number) {
        if (this.type !== 'span') {
            console.error("only span node can have text");
            return;
        }
        this.text = this.text.slice(0, index) + text + this.text.slice(index);
    }

    static createDefaultState(): StateNode {
        const root = new StateNode('root');

        const paragraph = new StateNode('paragraph', root);
        root.appendNode(paragraph);

        const span = new StateNode('span', paragraph);
        span.text = "12312312321";
        paragraph.appendNode(span);

        return root;
    }
}
