import { StateNodeType } from "./state-node.enum";

export class StateNode {
    public type: StateNodeType;
    public parent: StateNode | undefined;
    public children: StateNode[];
    private text?: string | undefined;
    public format?: string[];

    constructor(type: StateNodeType) {
        this.type = type;
        this.children = [];
        if (type === "root") {
            return;
        }
    }

    bold() {
        if (this.type !== "span") {
            console.error("only span node can be bold");
            return;
        }
        if (!this.format) {
            this.format = [];
        }
        if (this.format.includes("bold")) {
            return;
        }
        this.format.push("bold");
    }

    merge(other: StateNode) {
        this.children.push(...other.children);
        other.remove();
    }

    empty() {
        this.children.forEach((child) => child.remove());
    }

    remove() {
        const parent = this.parent;
        if (!parent) {
            console.error("no parent");
            return;
        }
        const index = parent.children.indexOf(this);
        parent.children.splice(index, 1);
        this.parent = undefined;
    }

    appendNode(node: StateNode) {
        if (node.parent) {
            console.error("node already has parent. detach first");
            return;
        }
        this.children.push(node);
        node.parent = this;
    }

    isEmpty() {
        return this.children.length === 0;
    }

    public getText() {
        if (this.type !== "span") {
            console.error("only span node can have text");
            return;
        }
        return this.text;
    }

    public setText(text: string) {
        if (this.type !== "span") {
            console.error("only span node can have text");
            return;
        }
        this.text = text;
    }

    public spliceText(text: string, index = 0) {
        if (this.type !== "span") {
            console.error("only span node can have text");
            return;
        }
        if (this.text === undefined) {
            this.text = "";
        }
        this.text = this.text.slice(0, index) + text + this.text.slice(index);
    }

    static createRootState(): StateNode {
        return new StateNode(StateNodeType.ROOT);
    }

    public findPathToAncestorNode(node: StateNode): StateNode[] {
        const path: StateNode[] = [];
        let current: StateNode = this;
        while (current !== node) {
            path.push(current);
            current = current.parent;
        }
        path.push(node);
        return path;
    }

    public findPathToRoot(): StateNode[] {
        const path: StateNode[] = [];
        let current: StateNode = this;
        while (current) {
            path.push(current);
            current = current.parent;
        }
        return path;
    }

    public static findLowestCommonAncestor(
        node1: StateNode,
        node2: StateNode
    ): StateNode | undefined {
        const path1 = node1.findPathToRoot();
        const path2 = node2.findPathToRoot();
        const setPath2 = new Set(path2);
        for (const node of path1) {
            if (setPath2.has(node)) {
                return node;
            }
        }
        console.error("no common ancestor found");
    }

    public static traversalAfterPath(path: StateNode[]) {
        const result: StateNode[] = [];
        if (path.length === 1) {
            result.push(path[0]);
            return result;
        }

        const stack: StateNode[] = [];

        let i = path.length - 2;
        while (i >= 0) {
            const current = path[i];
            const parent = current.parent;
            if (parent) {
                const index = parent.children.indexOf(current);
                for (let j = parent.children.length - 1; j >= index; j--) {
                    stack.push(parent.children[j]);
                }
            }
            i--;
        }

        while (stack.length > 0) {
            const current = stack.pop();
            const index = path.indexOf(current);
            if (index === -1) {
                result.push(...current.preOrderTraversal());
                continue;
            }
            if (index === 0) {
                result.push(current);
                continue;
            }
        }

        return result;
    }

    static from(element: HTMLElement) {
        if (element.nodeName === "P") {
            return new StateNode(StateNodeType.PARAGRAPH);
        }
        if (element.nodeName === "SPAN") {
            return new StateNode(StateNodeType.SPAN);
        }
    }

    static traversalBeforePath(p: StateNode[]): StateNode[] {
        const path = Array.from(p);

        const states = [];

        const current = path.pop();
        states.push(current);

        while (path.length > 0) {
            const current = path.pop();
            const parent = current.parent;
            const index = parent.children.indexOf(current);
            if (index >= 1) {
                for (let i = 0; i < index; i++) {
                    states.push(...parent.children[i].preOrderTraversal());
                }
            }

            states.push(current);
        }

        return states;
    }

    public preOrderTraversal(): StateNode[] {
        const stack: StateNode[] = [this];
        const result: StateNode[] = [];

        while (stack.length > 0) {
            const current = stack.pop();
            result.push(current);

            for (let i = current.children.length - 1; i >= 0; i--) {
                stack.push(current.children[i]);
            }
        }

        return result;
    }

    public levelOrderTraversal(): StateNode[] {
        const result: StateNode[] = [this];
        const stack: StateNode[] = [this];

        while (stack.length > 0) {
            const current = stack.shift();
            for (const child of current.children) {
                result.push(child);
                stack.push(child);
            }
        }

        return result;
    }

    static determineLeftRight(
        node1: StateNode,
        node2: StateNode
    ): [StateNode, StateNode] {
        const ancestor = StateNode.findLowestCommonAncestor(node1, node2);
        const path1 = node1.findPathToAncestorNode(ancestor);
        const path2 = node2.findPathToAncestorNode(ancestor);
        if (path1.length === 1) {
            return [node1, node2];
        }
        if (path2.length === 1) {
            return [node2, node1];
        }
        const index1 = path1[path1.length - 1].children.indexOf(
            path1[path1.length - 2]
        );
        const index2 = path2[path2.length - 1].children.indexOf(
            path2[path2.length - 2]
        );
        if (index1 < index2) {
            return [node1, node2];
        }
        if (index1 > index2) {
            return [node2, node1];
        }

        return [node1, node2];
    }

    public static findStatesBetween(
        node1: StateNode,
        node2: StateNode
    ): StateNode[] {
        const result: StateNode[] = [];

        const [left, right] = StateNode.determineLeftRight(node1, node2);

        const ancestor = StateNode.findLowestCommonAncestor(left, right);
        const path1 = left.findPathToAncestorNode(ancestor);
        const path2 = right.findPathToAncestorNode(ancestor);

        if (path1.length === 1) {
            result.push(...StateNode.traversalBeforePath(path2));
            return result;
        }
        if (path2.length === 1) {
            result.push(...StateNode.traversalBeforePath(path1));
            return result;
        }

        const index1 = ancestor.children.indexOf(path1[path1.length - 2]);
        const index2 = ancestor.children.indexOf(path2[path2.length - 2]);

        result.push(
            ...StateNode.traversalAfterPath(path1.slice(0, path1.length - 1))
        );
        for (let i = index1 + 1; i < index2; i++) {
            result.push(...ancestor.children[i].preOrderTraversal());
        }
        result.push(
            ...StateNode.traversalBeforePath(path2.slice(0, path2.length - 1))
        );

        return result;
    }

    getPreviousSibling() {
        if (!this.parent) {
            console.error("no parent");
            return;
        }
        const index = this.parent.children.indexOf(this);
        if (index === 0) {
            return;
        }
        return this.parent.children[index - 1];
    }

    getNextSibling() {
        if (!this.parent) {
            console.error("no parent");
            return;
        }
        const index = this.parent.children.indexOf(this);
        if (index === this.parent.children.length - 1) {
            return;
        }
        return this.parent.children[index + 1];
    }

    public addNextSiblings(nodes: StateNode[]) {
        for (const node of nodes) {
            if (node.parent) {
                console.error("node already has parent. detach first");
            }
        }

        this.parent.children.splice(
            this.parent.children.indexOf(this) + 1,
            0,
            ...nodes
        );

        nodes.forEach((node) => (node.parent = this.parent));
    }
}
