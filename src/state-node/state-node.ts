export class StateNode {
    public type: string;
    public parent: StateNode | null;
    public children: StateNode[];
    public text?: string;
    public format?: string[];

    constructor(type: string, parent: StateNode | null = null) {
        this.type = type;
        this.parent = parent;
        this.children = [];
    }

    appendNode(node: StateNode) {
        this.children.push(node);
    }

    setText(text: string, index: number) {
        if (this.type !== "span") {
            console.error("only span node can have text");
            return;
        }
        this.text = this.text.slice(0, index) + text + this.text.slice(index);
    }

    static createDefaultState(): StateNode {
        const root = new StateNode("root");

        const paragraph = new StateNode("paragraph", root);
        root.appendNode(paragraph);

        const span = new StateNode("span", paragraph);
        span.text = "12312312321";
        paragraph.appendNode(span);

        return root;
    }

    public findPathToNode(node: StateNode): StateNode[] {
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
        let current: StateNode | null = this;
        while (current) {
            path.push(current);
            current = current.parent;
        }
        return path;
    }

    public static findLowestCommonAncestor(
        node1: StateNode,
        node2: StateNode
    ): StateNode | null {
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

    static determineLeftRight(
        node1: StateNode,
        node2: StateNode
    ): [StateNode, StateNode] {
        const ancestor = StateNode.findLowestCommonAncestor(node1, node2);
        const path1 = node1.findPathToNode(ancestor);
        const path2 = node2.findPathToNode(ancestor);
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

    public static findStatesBetween(node1: StateNode, node2: StateNode): StateNode[] {
        const result: StateNode[] = [];

        const [left, right] = StateNode.determineLeftRight(node1, node2);

        const ancestor = StateNode.findLowestCommonAncestor(left, right);
        const path1 = left.findPathToNode(ancestor);
        const path2 = right.findPathToNode(ancestor);
        
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

        result.push(...StateNode.traversalAfterPath(path1.slice(0, path1.length - 1)));
        for (let i = index1 + 1; i < index2; i++) {
            result.push(...ancestor.children[i].preOrderTraversal());
        }
        result.push(...StateNode.traversalBeforePath(path2.slice(0, path2.length - 1)));


        return result;
    }
}
