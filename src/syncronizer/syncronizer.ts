import { DomNode } from "../dom/dom-node";
import { TextFormat } from "../enum/text-format";
import { VDomNode } from "../vdom/vdom-node";
import { editScript } from "./algorithm/edit-script";
import { LCS } from "./algorithm/lcs";
import { Hook } from "./decorator/hook";
import _ from "lodash";

export class Synchronizer {
    private undoStack: VDomNode[] = [];
    private redoStack: VDomNode[] = [];

    constructor(private dom: DomNode, private vdom: VDomNode) {}

    private saveCurrentVdom() {
        this.undoStack.push(this.vdom.deepClone());
    }

    private replaceVDom(currentVdom: VDomNode, newVdom: VDomNode) {
        const stack: [VDomNode, VDomNode][] = [[currentVdom, newVdom]];

        while (stack.length > 0) {
            const [currentNode, newNode] = stack.pop();

            if (currentNode.hash === newNode.hash) continue;

            if (currentNode.getText() !== newNode.getText()) {
                this.setText(currentNode, newNode.getText());
            }

            if (!_.isEqual(currentNode.getFormats(), newNode.getFormats())) {
                for (const format of newNode.getFormats()) {
                    this.format(currentNode, format);
                }
            }

            const oldChildren = currentNode.getChildren();
            const newChildren = newNode.getChildren();
            const lcs = LCS(oldChildren, newChildren); // returns list of [oldIdx, newIdx]
            // index pair 구하기
            const lcsIndexPairs: [number, number][] = [];
            let oldIdx = 0;
            let newIdx = 0;
            for (const node of lcs) {
                while (!oldChildren[oldIdx].isEqual(node)) oldIdx++;
                while (!newChildren[newIdx].isEqual(node)) newIdx++;
                lcsIndexPairs.push([oldIdx, newIdx]);
                oldIdx++;
                newIdx++;
            }
            const edits = editScript(oldChildren, newChildren, lcs);

            for (const op of edits) {
                if (op.edit === "insert") {
                    this.attachSubVdom(
                        currentNode,
                        op.at,
                        op.vnode.deepClone()
                    );
                } else if (op.edit === "delete") {
                    this.detachVdom(currentNode, op.vnode); // should update hash internally
                }
            }

            // 재귀 비교 stack에 push
            for (const [aIdx, bIdx] of lcsIndexPairs) {
                stack.push([oldChildren[aIdx], newChildren[bIdx]]);
            }
        }
    }

    detachVdom(vdomNode: VDomNode, target: VDomNode) {
        const domNode = this.findDomNodeFrom(vdomNode);
        const targetDomNode = this.findDomNodeFrom(target);
        vdomNode.detach(target);
        domNode.detach(targetDomNode);
    }

    attachSubVdom(vdomNode: VDomNode, at: number, subVdom: VDomNode) {
        const domNode = this.findDomNodeFrom(vdomNode);
        const subDom = DomNode.fromVdom(subVdom);
        vdomNode.attach(subVdom, at);
        domNode.attach(subDom, at);
    }

    public undo() {
        if (this.undoStack.length === 0) return;
        const lastVdom = this.undoStack.pop();
        this.redoStack.push(this.vdom.deepClone());
        this.replaceVDom(this.vdom, lastVdom);
        this.vdom = lastVdom;
    }

    public redo() {}

    @Hook<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public setText(spanVDomNode: VDomNode, text: string, isFromDom = false) {
        if (spanVDomNode.type !== "span") {
            console.error("spanVDomNode.type !== span");
            return;
        }
        spanVDomNode.setText(text);
        if (isFromDom) {
            return;
        }
        const span = this.findDomNodeFrom(spanVDomNode);
        span.getElement().textContent = text;
    }

    @Hook<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public format(vSpan: VDomNode, textFormat: TextFormat) {
        const span = this.findDomNodeFrom(vSpan);
        vSpan.setFormat(textFormat);
        span.setFormat(textFormat);
    }

    @Hook<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public merge(vParagraph1: VDomNode, vParagraph2: VDomNode) {
        const paragraph1 = this.findDomNodeFrom(vParagraph1);
        const paragraph2 = this.findDomNodeFrom(vParagraph2);
        if (!paragraph1) {
            console.error("paragraph1 is undefined");
        }
        if (!(paragraph1.getElement() instanceof HTMLElement)) {
            console.error("paragraph1's element is not HTMLElement");
            return;
        }
        vParagraph1.absorb(vParagraph2);
        paragraph1.absorb(paragraph2);
    }

    @Hook<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public appendNewVDomNode(vParent: VDomNode, vChild: VDomNode) {
        const parent = this.findDomNodeFrom(vParent);
        const child = DomNode.from(vChild);
        vParent.attachLast(vChild);
        parent.attachLast(child);
    }

    @Hook<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public appendNewDomNode(parent: DomNode, child: DomNode) {
        const vParent = this.findVDomNodeFrom(parent);
        const vChild = VDomNode.from(child.getElement());
        vParent.attachLast(vChild);
        parent.attachLast(child);
    }

    @Hook<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public remove(vdomNode: VDomNode) {
        const domNode = this.findDomNodeFrom(vdomNode);
        const parent = domNode.getParent();
        const vParent = vdomNode.parent;
        vParent.detach(vdomNode);
        parent.detach(domNode);
        if (parent && parent.getNodeName() === "P" && parent.isEmpty()) {
            parent.getElement().innerHTML = "<br>";
        }
    }

    @Hook<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public addNewNextSiblings(vdomNode: VDomNode, siblings: VDomNode[]) {
        const domNode = this.findDomNodeFrom(vdomNode);
        vdomNode.addNextSiblings(siblings);
        const siblingDomNodes = siblings.map((sibling) =>
            DomNode.from(sibling)
        );
        domNode.addNextSiblings(siblingDomNodes);
    }

    private findPathToRoot(element: HTMLElement): number[] {
        const path: number[] = [];
        while (element.id !== "@editor") {
            if (!element.parentElement) {
                console.error("element.parentElement is undefined");
                return [];
            }
            const index = Array.prototype.indexOf.call(
                element.parentElement.children,
                element
            );
            path.push(index);
            element = element.parentElement;
        }
        return path;
    }

    private findPathToVRoot(vdomNode: VDomNode): number[] {
        const path: number[] = [];
        while (vdomNode.type !== "root") {
            if (!vdomNode.parent) {
                console.log(vdomNode)
                console.error("vdomNode.parent is undefined");
                return [];
            }
            const index = vdomNode.parent.getChildren().indexOf(vdomNode);
            path.push(index);
            vdomNode = vdomNode.parent;
        }
        return path;
    }

    public findVDomNodeFrom(domElement: DomNode): VDomNode {
        const element = domElement.getElement();
        const path = this.findPathToRoot(element);
        if (path.length === 0) {
            return this.vdom;
        }
        let vdomNode = this.vdom;
        for (let i = path.length - 1; i >= 0; i--) {
            vdomNode = vdomNode.getChildren()[path[i]];
        }
        return vdomNode;
    }

    public findDomNodeFrom(vdomNode: VDomNode): DomNode {
        const path = this.findPathToVRoot(vdomNode);
        if (path.length === 0) {
            return this.dom;
        }
        let element = this.dom;
        for (let i = path.length - 1; i >= 0; i--) {
            const e = element.getChildren()[path[i]];
            if (!e) {
                console.error("element is undefined");
                return null;
            }
            if (!(e.getElement() instanceof HTMLElement)) {
                console.error("element is not HTMLElement");
                return null;
            }
            element = e;
        }
        return element;
    }

    public checkSync(): boolean {
        const vDomStack: VDomNode[] = [this.vdom];
        const domStack: DomNode[] = [this.dom];
        while (vDomStack.length > 0) {
            const vNode = vDomStack.pop();
            const domNode = domStack.pop();
            if (vNode.type === "root") {
                if (domNode.getElement().id !== "@editor") {
                    throw new Error(
                        "vNode.type === root && domNode.id !== @editor"
                    );
                }
            }

            if (vNode.type === "paragraph") {
                if (domNode.getElement().nodeName !== "P") {
                    throw new Error(
                        "vNode.type === paragraph && domNode.nodeName !== P"
                    );
                }
                if (vNode.isEmpty() !== domNode.isEmpty()) {
                    throw new Error("vNode.isEmpty() !== domNode.isEmpty()");
                }
            }

            if (vNode.type === "span") {
                if (domNode.getElement().nodeName !== "SPAN") {
                    throw new Error(
                        "vNode.type === span && domNode.nodeName !== SPAN"
                    );
                }
                const vFormats = vNode.getFormats().sort();
                const formats = domNode.getFormats().sort();
                if (vFormats.length !== formats.length) {
                    throw new Error("vFormats.length !== formats.length");
                }
                for (let i = 0; i < vFormats.length; i++) {
                    if (vFormats[i] !== formats[i]) {
                        throw new Error("vFormats[i] !== formats[i]");
                    }
                }

                if (vNode.getText() === null && domNode.getText() !== "") {
                    throw new Error(
                        "vNode.getText() === null && domNode.getText() !== ''"
                    );
                }

                if (vNode.getText() && vNode.getText() !== domNode.getText()) {
                    console.log(vNode.getText(), domNode.getText());
                    throw new Error("vNode.getText() !== domNode.getText()");
                }
            }
            vDomStack.push(...vNode.getChildren());
            domStack.push(...domNode.getChildren());
        }
        return true;
    }
}
