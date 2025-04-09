import { EditorNode } from "../interface/editor-node.interface";
import { TextFormat } from "../enum/text-format";
import { Equatable } from "../interface/equatable.interface";
import { UpdateHash } from "./decorator/update-hash";
import { VDomNodeType } from "./vdom-node.enum";

export class VDomNode implements EditorNode<VDomNode>, Equatable<VDomNode> {
    static HASH_LOCKED = false;
    static VDOM_ID_SEQ = 0;
    static lockHash() {
        this.HASH_LOCKED = true;
    }
    static unlockHash() {
        this.HASH_LOCKED = false;
    }

    public parent: VDomNode | null;
    private children: VDomNode[];
    private text?: string | null;
    public format?: TextFormat[];
    public hash: string;

    constructor(
        readonly type: VDomNodeType,
        readonly id = VDomNode.VDOM_ID_SEQ++
    ) {
        this.parent = null;
        this.children = [];
        this.text = null;
        this.format = [];
    }

    public isEqual(other: VDomNode): boolean {
        return this.hash === other.hash;
    }

    deepClone(): VDomNode {
        VDomNode.lockHash();
        const clone = new VDomNode(this.type, this.id);
        clone.text = this.text;
        clone.format = [...this.format];
        clone.hash = this.hash;

        for (const child of this.children) {
            const childClone = child.deepClone();
            clone.attachLast(childClone);
        }

        clone.parent = null;
        VDomNode.unlockHash();
        return clone;
    }

    getParent(): VDomNode {
        return this.parent;
    }

    getChildren(): VDomNode[] {
        return this.children;
    }

    @UpdateHash()
    setFormat(format: TextFormat) {
        if (this.type !== "span") {
            console.error("only span node can be bold");
            return;
        }
        if (!this.format) {
            this.format = [];
        }
        if (this.format.includes(format)) {
            return;
        }
        this.format.push(format);
        this.format.sort();
    }

    getFormats(): TextFormat[] {
        return this.format;
    }

    @UpdateHash()
    public absorb(other: VDomNode) {
        for (const child of other.getChildren()) {
            other.detach(child);
            this.attachLast(child);
        }
        const otherParent = other.parent;
        otherParent.detach(other);
    }

    @UpdateHash()
    public remove() {
        const parent = this.parent;
        if (!parent) {
            console.error("no parent");
            return;
        }
        const index = parent.children.indexOf(this);
        parent.children.splice(index, 1);
        this.parent = null;
    }

    @UpdateHash()
    public empty() {
        while (this.children.length > 0) {
            this.detach(this.getChildren()[0]);
        }
    }

    attachLast(node: VDomNode) {
        this.attach(node, this.getChildren().length);
    }

    attach(node: VDomNode, at: number) {
        if (node.parent) {
            console.error("node already has parent. detach first");
            return;
        }
        this.getChildren().splice(at, 0, node);
        node.parent = this;
    }

    detach(node: VDomNode) {
        const at = this.getChildren().indexOf(node);
        if (at === -1) {
            console.error("node is not child");
            return;
        }
        const detached = this.getChildren().splice(at, 1)[0];
        detached.parent = null;
        return detached;
    }

    isEmpty() {
        return this.children.length === 0;
    }

    public getText() {
        return this.text;
    }

    @UpdateHash()
    public setText(text: string) {
        if (this.type !== "span") {
            console.error("only span node can have text");
            return;
        }
        this.text = text;
    }

    @UpdateHash()
    public spliceText(text: string, index = 0) {
        if (this.type !== "span") {
            console.error("only span node can have text");
            return;
        }
        if (this.text === null) {
            this.text = "";
        }
        this.text = this.text.slice(0, index) + text + this.text.slice(index);
    }

    static createRootNode(): VDomNode {
        return new VDomNode(VDomNodeType.ROOT);
    }

    public findPathToAncestorNode(node: VDomNode): VDomNode[] {
        const path: VDomNode[] = [];
        let current: VDomNode = this;
        while (current !== node) {
            path.push(current);
            current = current.parent;
        }
        path.push(node);
        return path;
    }

    public findPathToRoot(): VDomNode[] {
        const path: VDomNode[] = [];
        let current: VDomNode = this;
        while (current) {
            path.push(current);
            current = current.parent;
        }
        return path;
    }

    public static findLowestCommonAncestor(
        node1: VDomNode,
        node2: VDomNode
    ): VDomNode | undefined {
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

    public static traversalAfterPath(path: VDomNode[]) {
        const result: VDomNode[] = [];
        if (path.length === 1) {
            result.push(path[0]);
            return result;
        }

        const stack: VDomNode[] = [];

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
                result.push(...VDomNode.preOrderTraversal(current));
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
            return new VDomNode(VDomNodeType.PARAGRAPH);
        }
        if (element.nodeName === "SPAN") {
            const vSpan = new VDomNode(VDomNodeType.SPAN);
            if (element.textContent) {
                vSpan.setText(element.textContent);
            }
            return vSpan;
        }
    }

    public static traversalBeforePath(p: VDomNode[]): VDomNode[] {
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
                    states.push(
                        ...VDomNode.preOrderTraversal(parent.children[i])
                    );
                }
            }
            states.push(current);
        }

        return states;
    }

    public static preOrderTraversal(from: VDomNode): VDomNode[] {
        const stack: VDomNode[] = [from];
        const result: VDomNode[] = [];

        while (stack.length > 0) {
            const current = stack.pop();
            result.push(current);

            for (let i = current.children.length - 1; i >= 0; i--) {
                stack.push(current.children[i]);
            }
        }

        return result;
    }

    public levelOrderTraversal(): VDomNode[] {
        const result: VDomNode[] = [this];
        const stack: VDomNode[] = [this];

        while (stack.length > 0) {
            const current = stack.shift();
            for (const child of current.children) {
                result.push(child);
                stack.push(child);
            }
        }

        return result;
    }

    // ELEMENTS에 대한 순서를 알 수 있어서 이 함수가 필요없음.
    // 이후를 위해 남겨두기
    public static determineLeftRight(
        node1: VDomNode,
        node2: VDomNode
    ): [VDomNode, VDomNode] {
        const ancestor = VDomNode.findLowestCommonAncestor(node1, node2);
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

    public static findVDomNodesBetween(
        left: VDomNode,
        right: VDomNode
    ): VDomNode[] {
        const result: VDomNode[] = [];

        const ancestor = VDomNode.findLowestCommonAncestor(left, right);
        const path1 = left.findPathToAncestorNode(ancestor);
        const path2 = right.findPathToAncestorNode(ancestor);

        if (path1.length === 1) {
            result.push(...VDomNode.traversalBeforePath(path2));
            return result;
        }
        if (path2.length === 1) {
            result.push(...VDomNode.traversalBeforePath(path1));
            return result;
        }

        const index1 = ancestor.children.indexOf(path1[path1.length - 2]);
        const index2 = ancestor.children.indexOf(path2[path2.length - 2]);

        result.push(
            ...VDomNode.traversalAfterPath(path1.slice(0, path1.length - 1))
        );
        for (let i = index1 + 1; i < index2; i++) {
            result.push(...VDomNode.preOrderTraversal(ancestor.children[i]));
        }
        result.push(
            ...VDomNode.traversalBeforePath(path2.slice(0, path2.length - 1))
        );

        return result;
    }

    public getPreviousSibling() {
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

    public getNextSibling() {
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

    @UpdateHash()
    public addNextSiblings(nodes: VDomNode[]) {
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

    public printTree(depth = 0): void {
        const indent = " ".repeat(depth * 2);
        const text = this.getText?.() ?? "";
        const formats = this.getFormats?.().join(", ") ?? "";
        console.log(
            `${indent}${this.type}${text ? `: "${text}"` : ""}${
                formats ? ` [${formats}]` : ""
            } - ${this.id} / ${this.hash}`
        );
        this.getChildren().forEach((child) => child.printTree(depth + 1));
    }
}
