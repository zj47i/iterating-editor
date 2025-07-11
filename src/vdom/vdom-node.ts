import { EditorNode } from "../interface/editor-node.interface";
import { TextFormat } from "../enum/text-format";
import { Equatable } from "../syncronizer/algorithm/equatable.interface";
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

    private parent: VDomNode | null;
    private children: VDomNode[];
    private text: string | null;
    private format: TextFormat[];
    private hash: string;
    private structHash: string;

    constructor(
        readonly type: VDomNodeType,
        readonly id = VDomNode.VDOM_ID_SEQ++
    ) {
        this.parent = null;
        this.children = [];
        this.format = [];

        this.setHash();
    }

    public static createVSpan(text: string) {
        const vSpan = new VDomNode(VDomNodeType.SPAN);
        vSpan.setText(text);
        return vSpan;
    }

    private fnv1a(str: string) {
        let hash = 2166136261;
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash +=
                (hash << 1) +
                (hash << 4) +
                (hash << 7) +
                (hash << 8) +
                (hash << 24);
        }
        return (hash >>> 0).toString(16);
    }

    private setHash() {
        const data = JSON.stringify({
            id: this.id,
            text: this.type === VDomNodeType.SPAN ? this.getText() : null,
            format: this.getFormats(),
            childrenHash: this.getChildren().map((c: any) => c.hash),
        });
        this.hash = this.fnv1a(data);
    }

    public isEqual(other: VDomNode): boolean {
        return this.hash === other.hash;
    }

    deepClone(): VDomNode {
        VDomNode.lockHash();
        const clone = new VDomNode(this.type, this.id);
        clone.text = this.text;
        clone.format = this.format.map((f) => f);
        clone.hash = this.hash;

        for (const child of this.children) {
            const childClone = child.deepClone();
            clone.attachLast(childClone);
        }

        clone.parent = null;
        VDomNode.unlockHash();
        return clone;
    }

    getParent(): VDomNode | null {
        return this.parent;
    }

    getChildren(): VDomNode[] {
        return this.children;
    }

    @UpdateHash()
    setFormat(format: TextFormat) {
        if (this.type !== "span") {
            throw new Error("only span node can be bold");
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
        if (otherParent) otherParent.detach(other);
    }

    @UpdateHash()
    public remove() {
        const parent = this.parent;
        if (!parent) {
            throw new Error("no parent");
        }
        const index = parent.children.indexOf(this);
        parent.children.splice(index, 1);
        this.parent = null;
    }

    public empty() {
        while (this.children.length > 0) {
            this.detach(this.getChildren()[0]);
        }
    }

    attachLast(node: VDomNode) {
        this.attach(node, this.getChildren().length);
    }

    @UpdateHash()
    attach(node: VDomNode, at: number) {
        if (node.parent) {
            throw new Error("node already has parent. detach first");
        }
        this.getChildren().splice(at, 0, node);
        node.parent = this;
    }

    @UpdateHash()
    detach(node: VDomNode) {
        const at = this.getChildren().indexOf(node);
        if (at === -1) {
            throw new Error("node is not child");
        }
        const detached = this.getChildren().splice(at, 1)[0];
        detached.parent = null;
        return detached;
    }

    isEmpty() {
        return this.children.length === 0;
    }

    public getText() {
        if (this.type !== "span") {
            throw new Error("only span node can have text");
        }
        if (this.text === null) {
            throw new Error("text is null");
        }
        return this.text;
    }

    @UpdateHash()
    public setText(text: string) {
        if (this.type !== "span") {
            throw new Error("only span node can have text");
        }
        this.text = text;
    }

    @UpdateHash()
    public insertText(text: string, index = 0) {
        if (text === null || text === undefined) {
            throw new Error("text is null");
        }
        if (this.type !== "span") {
            throw new Error("only span node can have text");
        }
        if (this.text === null) {
            return this.setText(text);
        }
        this.text = this.text.slice(0, index) + text + this.text.slice(index);
    }

    public findPathToAncestorNode(node: VDomNode): VDomNode[] {
        const path: VDomNode[] = [];
        let current: VDomNode | null = this;
        while (current && current !== node) {
            path.push(current);
            current = current.parent;
        }
        path.push(node);
        return path;
    }

    /**
     * Returns the path from this node up to the VDOM root as an array of child indices.
     * The path is ordered from this node up to the root (not reversed).
     * Example: [2, 0, 1] means: this node is the 2nd child of its parent, that parent is the 0th child of its parent, etc.
     */
    public findPathToRoot(): number[] {
        const path: number[] = [];
        let node: VDomNode = this;
        while (node.type !== "root") {
            const parent = node.getParent();
            if (!parent) return [];
            const index = parent.getChildren().indexOf(node);
            path.push(index);
            node = parent;
        }
        return path;
    }

    static createRootNode(): VDomNode {
        return new VDomNode(VDomNodeType.ROOT);
    }

    public static findLowestCommonAncestor(
        node1: VDomNode,
        node2: VDomNode
    ): VDomNode {
        const path1 = node1.findPathToAncestorNode(VDomNode.getRoot(node1));
        const path2 = node2.findPathToAncestorNode(VDomNode.getRoot(node2));
        let lca: VDomNode | null = null;
        let i = path1.length - 1;
        let j = path2.length - 1;
        while (i >= 0 && j >= 0 && path1[i] === path2[j]) {
            lca = path1[i];
            i--;
            j--;
        }
        if (!lca) throw new Error("no common ancestor");
        return lca;
    }

    // 올라가는 방향의 Path
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
            const current = stack.pop()!;
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

    static from(element: HTMLElement): VDomNode {
        if (element.nodeName === "P") {
            return new VDomNode(VDomNodeType.PARAGRAPH);
        }
        if (element.nodeName === "SPAN") {
            if (!element.textContent) {
                throw new Error("textContent is null");
            }
            const vSpan = VDomNode.createVSpan(element.textContent);

            return vSpan;
        }
        throw new Error("unknown element");
    }

    // 넘어오는 path는 root로 향하는 방향
    public static traversalBeforePath(p: VDomNode[]): VDomNode[] {
        const path = Array.from(p);
        const vDomNodes: VDomNode[] = [];
        vDomNodes.push(path.pop()!);
        while (path.length > 0) {
            const current = path.pop()!;
            const parent = current.getParent();
            if (!parent) {
                throw new Error("no parent");
            }
            const index = parent.children.indexOf(current);
            if (index >= 1) {
                for (let i = 0; i < index; i++) {
                    vDomNodes.push(
                        ...VDomNode.preOrderTraversal(parent.children[i])
                    );
                }
            }
            vDomNodes.push(current);
        }

        return vDomNodes;
    }

    public static preOrderTraversal(from: VDomNode): VDomNode[] {
        const stack: VDomNode[] = [from];
        const result: VDomNode[] = [];

        while (stack.length > 0) {
            const current = stack.pop()!;
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
            const current = stack.shift()!;
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
            throw null;
        }
        const index = this.parent.children.indexOf(this);
        if (index === 0) {
            return null;
        }
        return this.parent.children[index - 1];
    }

    public getNextSibling() {
        if (!this.parent) {
            throw null;
        }
        const index = this.parent.children.indexOf(this);
        if (index === this.parent.children.length - 1) {
            return null;
        }
        return this.parent.children[index + 1];
    }

    @UpdateHash()
    public addNextSiblings(nodes: VDomNode[]) {
        for (const node of nodes) {
            if (node.parent) {
                throw new Error("node already has parent. detach first");
            }
        }

        const parent = this.getParent();
        if (!parent) {
            throw new Error("no parent");
        }

        parent.children.splice(parent.children.indexOf(this) + 1, 0, ...nodes);

        nodes.forEach((node) => (node.parent = this.parent));
    }

    /**
     * Returns the root node of the given VDomNode by traversing up the parent chain.
     */
    public static getRoot(node: VDomNode): VDomNode {
        let current: VDomNode = node;
        while (current.getParent()) {
            current = current.getParent()!;
        }
        return current;
    }

    public printTree({ depth = 0, prefix = "" }): void {
        const indent = " ".repeat(depth * 2);
        let text;
        if (this.type === VDomNodeType.SPAN) {
            text = this.getText();
        } else {
            text = "";
        }
        const formats = this.getFormats?.().join(", ") ?? "";
        console.log(
            prefix,
            `${indent}${this.type}${text ? `: "${text}"` : ""}${
                formats ? ` [${formats}]` : ""
            } - ${this.id} / ${this.hash}`
        );
        this.getChildren().forEach((child) =>
            child.printTree({ depth: depth + 1, prefix })
        );
    }
}
