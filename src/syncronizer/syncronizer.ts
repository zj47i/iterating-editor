import { position } from "../command/selection/position";
import { DomNode } from "../dom/dom-node";
import { TextFormat } from "../enum/text-format";
import { VDomNode } from "../vdom/vdom-node";
import { VDomNodeType } from "../vdom/vdom-node.enum";
import { editScript } from "./algorithm/edit-script";
import { LCS } from "./algorithm/lcs";
import { HookBefore } from "./decorator/hook-before";
import {
    SelectionStateMachine,
    State,
} from "../state-machine/selection.state-machine";

import _ from "lodash";
import { UndoRedoManager } from "./undo-redo-manager";
import { DomVDomConverter } from "../shared/dom-vdom-converter";

export class Synchronizer {
    private undoRedoManager = new UndoRedoManager();

    constructor(
        private dom: DomNode,
        private vdom: VDomNode,
        private selectionStateMachine: SelectionStateMachine
    ) {}

    private getCurrentCursorPosition(): State | null {
        if (!this.selectionStateMachine) {
            return null;
        }
        return this.selectionStateMachine.getState();
    }

    private saveCurrentVdom(cursorPosition?: State | null) {
        const actualCursorPosition =
            cursorPosition !== undefined
                ? cursorPosition
                : this.getCurrentCursorPosition();
        // 커서 위치를 VDOM 경로+offset으로 변환하여 저장
        let logicalCursor: { vdomPath: number[]; offset: number } | null = null;
        if (actualCursorPosition) {
            let vdomNode: VDomNode | null = null;
            let offset = actualCursorPosition.startOffset;
            if (actualCursorPosition.startContainer instanceof VDomNode) {
                vdomNode = actualCursorPosition.startContainer;
            } else if (actualCursorPosition.startContainer instanceof Node) {
                const domNode = DomNode.findFromElement(
                    actualCursorPosition.startContainer
                );
                if (domNode) {
                    vdomNode = this.findVDomNodeFrom(domNode);
                }
            }
            if (vdomNode) {
                logicalCursor = {
                    vdomPath: vdomNode.findPathToRoot(),
                    offset,
                };
            }
        }
        this.undoRedoManager.push(this.vdom.deepClone(), logicalCursor);
    }

    private setTextInternal(spanVDomNode: VDomNode, text: string) {
        if (spanVDomNode.type !== "span") {
            throw new Error("spanVDomNode is not span");
        }
        spanVDomNode.setText(text);
        const span = this.findDomNodeFrom(spanVDomNode);
        span.getElement().textContent = text;
    }

    private replaceVDom(currentVdom: VDomNode, newVdom: VDomNode) {
        const stack: [VDomNode, VDomNode][] = [[currentVdom, newVdom]];

        while (stack.length > 0) {
            const [currentNode, newNode] = stack.pop()!;

            if (currentNode.isEqual(newNode)) continue;

            if (currentNode.type === VDomNodeType.SPAN) {
                if (currentNode.getText() !== newNode.getText()) {
                    this.setText(currentNode, newNode.getText());
                }
                if (
                    !_.isEqual(currentNode.getFormats(), newNode.getFormats())
                ) {
                    for (const format of newNode.getFormats()) {
                        this.format(currentNode, format);
                    }
                }
            }

            const oldChildren = currentNode.getChildren();
            const newChildren = newNode.getChildren();
            const lcs = LCS<VDomNode>(oldChildren, newChildren); // returns list of [oldIdx, newIdx]
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
            const operations = editScript<VDomNode>(
                oldChildren,
                newChildren,
                lcs
            );

            for (const op of operations) {
                if (op.edit === "insert") {
                    this.attachSubVdom(
                        currentNode,
                        op.at,
                        op.vnode.deepClone()
                    );
                } else if (op.edit === "delete") {
                    this.detachVdom(currentNode, op.at); // should update hash internally
                }
            }

            // 재귀 비교 stack에 push
            for (const [aIdx, bIdx] of lcsIndexPairs) {
                stack.push([oldChildren[aIdx], newChildren[bIdx]]);
            }
        }
    }

    detachVdom(vdomNode: VDomNode, at: number) {
        const domNode = this.findDomNodeFrom(vdomNode);
        vdomNode.detach(vdomNode.getChildren()[at]);
        domNode.detach(domNode.getChildren()[at]);
    }

    attachSubVdom(vdomNode: VDomNode, at: number, subVdom: VDomNode) {
        const domNode = this.findDomNodeFrom(vdomNode);
        const subDom = DomVDomConverter.createDomTreeFromVDomTree(subVdom);
        vdomNode.attach(subVdom, at);
        domNode.attach(subDom, at);
        position(
            subDom.getElement(),
            subDom.getNodeName() === "SPAN"
                ? subDom.getText().length
                : subDom.getChildren().length
        );
    }

    private replaceVdomDirectly(newVdom: VDomNode) {
        // Clear current DOM content
        const editorElement = this.dom.getElement();
        editorElement.innerHTML = "";

        // Clear current vdom children
        while (this.vdom.getChildren().length > 0) {
            this.vdom.detach(this.vdom.getChildren()[0]);
        }

        // Add new children to vdom
        for (const child of newVdom.getChildren()) {
            this.vdom.attachLast(child.deepClone());
        }

        // Rebuild DOM from vdom
        for (const child of this.vdom.getChildren()) {
            const domChild = DomVDomConverter.createDomTreeFromVDomTree(child);
            this.dom.attachLast(domChild);
        }
    }

    public undo() {
        const currentCursorPosition = this.getCurrentCursorPosition();
        // 현재 커서 위치도 VDOM 경로+offset으로 변환
        let logicalCurrent: { vdomPath: number[]; offset: number } | null =
            null;
        if (currentCursorPosition) {
            let vdomNode: VDomNode | null = null;
            let offset = currentCursorPosition.startOffset;
            if (currentCursorPosition.startContainer instanceof VDomNode) {
                vdomNode = currentCursorPosition.startContainer;
            } else if (currentCursorPosition.startContainer instanceof Node) {
                const domNode = DomNode.findFromElement(
                    currentCursorPosition.startContainer
                );
                if (domNode) {
                    vdomNode = this.findVDomNodeFrom(domNode);
                }
            }
            if (vdomNode) {
                logicalCurrent = {
                    vdomPath: vdomNode.findPathToRoot(),
                    offset,
                };
            }
        }
        const prevState = this.undoRedoManager.undo(
            this.vdom.deepClone(),
            logicalCurrent
        );
        if (prevState) {
            this.replaceVdomDirectly(prevState.vdom);
            // 커서 복원: VDOM 경로+offset 기반
            const logicalCursor = prevState.cursorPosition;
            if (logicalCursor && logicalCursor.vdomPath) {
                let vNode = this.vdom;
                for (let i = logicalCursor.vdomPath.length - 1; i >= 0; i--) {
                    vNode = vNode.getChildren()[logicalCursor.vdomPath[i]];
                }
                const domNode = this.findDomNodeFrom(vNode);
                const el = domNode.getElement();
                if (
                    el.firstChild &&
                    el.firstChild.nodeType === Node.TEXT_NODE
                ) {
                    const selection = document.getSelection();
                    if (selection) {
                        const range = document.createRange();
                        range.setStart(el.firstChild, logicalCursor.offset);
                        range.setEnd(el.firstChild, logicalCursor.offset);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            }
        }
    }

    public redo() {
        const currentCursorPosition = this.getCurrentCursorPosition();
        let logicalCurrent: { vdomPath: number[]; offset: number } | null =
            null;
        if (currentCursorPosition) {
            let vdomNode: VDomNode | null = null;
            let offset = currentCursorPosition.startOffset;
            if (currentCursorPosition.startContainer instanceof VDomNode) {
                vdomNode = currentCursorPosition.startContainer;
            } else if (currentCursorPosition.startContainer instanceof Node) {
                const domNode = DomNode.findFromElement(
                    currentCursorPosition.startContainer
                );
                if (domNode) {
                    vdomNode = this.findVDomNodeFrom(domNode);
                }
            }
            if (vdomNode) {
                logicalCurrent = {
                    vdomPath: vdomNode.findPathToRoot(),
                    offset,
                };
            }
        }
        const nextState = this.undoRedoManager.redo(
            this.vdom.deepClone(),
            logicalCurrent
        );
        if (nextState) {
            this.replaceVdomDirectly(nextState.vdom);
            // 커서 복원: VDOM 경로+offset 기반
            const logicalCursor = nextState.cursorPosition;
            if (logicalCursor && logicalCursor.vdomPath) {
                let vNode = this.vdom;
                for (let i = logicalCursor.vdomPath.length - 1; i >= 0; i--) {
                    vNode = vNode.getChildren()[logicalCursor.vdomPath[i]];
                }
                const domNode = this.findDomNodeFrom(vNode);
                const el = domNode.getElement();
                if (
                    el.firstChild &&
                    el.firstChild.nodeType === Node.TEXT_NODE
                ) {
                    const selection = document.getSelection();
                    if (selection) {
                        const range = document.createRange();
                        range.setStart(el.firstChild, logicalCursor.offset);
                        range.setEnd(el.firstChild, logicalCursor.offset);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            }
        }
    }

    @HookBefore<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public setText(spanVDomNode: VDomNode, text: string) {
        if (spanVDomNode.type !== "span") {
            throw new Error("spanVDomNode is not span");
        }
        spanVDomNode.setText(text);
        const span = this.findDomNodeFrom(spanVDomNode);
        span.getElement().textContent = text;
    }

    @HookBefore<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public setTextFromDom(spanDomNode: DomNode, text: string) {
        const vSpan = this.findVDomNodeFrom(spanDomNode);
        vSpan.setText(text);
    }

    @HookBefore<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public format(vSpan: VDomNode, textFormat: TextFormat) {
        const span = this.findDomNodeFrom(vSpan);
        vSpan.setFormat(textFormat);
        span.setFormat(textFormat);
    }

    @HookBefore<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public merge(vParagraph1: VDomNode, vParagraph2: VDomNode) {
        const paragraph1 = this.findDomNodeFrom(vParagraph1);
        const paragraph2 = this.findDomNodeFrom(vParagraph2);
        if (!paragraph1) {
            throw new Error("paragraph1 is undefined");
        }
        if (!(paragraph1.getElement() instanceof HTMLElement)) {
            throw new Error("paragraph1's element is not HTMLElement");
        }
        vParagraph1.absorb(vParagraph2);
        paragraph1.absorb(paragraph2);
    }

    public appendNewVDomNodeWithoutHook(vParent: VDomNode, vChild: VDomNode) {
        const parent = this.findDomNodeFrom(vParent);
        const child = DomVDomConverter.createDomFromVDom(vChild);
        vParent.attachLast(vChild);
        parent.attachLast(child);
    }

    @HookBefore<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public appendNewVDomNode(vParent: VDomNode, vChild: VDomNode) {
        const parent = this.findDomNodeFrom(vParent);
        const child = DomVDomConverter.createDomFromVDom(vChild);
        vParent.attachLast(vChild);
        parent.attachLast(child);
    }

    @HookBefore<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public appendNewDomNode(parent: DomNode, child: DomNode) {
        const vParent = this.findVDomNodeFrom(parent);
        const vChild = VDomNode.from(child.getElement());
        vParent.attachLast(vChild);
        parent.attachLast(child);
    }

    @HookBefore<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public remove(vdomNode: VDomNode) {
        const domNode = this.findDomNodeFrom(vdomNode);
        const parent = domNode.getParent();
        const vParent = vdomNode.getParent();
        if (!parent || !vParent) {
            throw new Error("parent or vParent is undefined");
        }
        vParent.detach(vdomNode);
        parent.detach(domNode);
        if (parent && parent.getNodeName() === "P" && parent.isEmpty()) {
            parent.getElement().innerHTML = "<br>";
        }
    }

    @HookBefore<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public addNewNextSiblings(vdomNode: VDomNode, siblings: VDomNode[]) {
        const domNode = this.findDomNodeFrom(vdomNode);
        vdomNode.addNextSiblings(siblings);
        const siblingDomNodes = siblings.map((sibling) =>
            DomVDomConverter.createDomFromVDom(sibling)
        );
        domNode.addNextSiblings(siblingDomNodes);
    }

    public findVDomNodeFrom(domNode: DomNode): VDomNode {
        const path = domNode.findPathToRoot();
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
        const path = vdomNode.findPathToRoot();
        if (path.length === 0) {
            return this.dom;
        }
        let element = this.dom;
        for (let i = path.length - 1; i >= 0; i--) {
            const e = element.getChildren()[path[i]];
            if (!e) {
                throw new Error("element is undefined");
            }
            if (!(e.getElement() instanceof HTMLElement)) {
                throw new Error("element is not HTMLElement");
            }
            element = e;
        }
        return element;
    }

    public checkSync(): boolean {
        const vDomStack: VDomNode[] = [this.vdom];
        const domStack: DomNode[] = [this.dom];
        while (vDomStack.length > 0 && domStack.length > 0) {
            if (vDomStack.length !== domStack.length) {
                throw new Error("vDomStack.length !== domStack.length");
            }
            const vNode = vDomStack.pop()!;
            const domNode = domStack.pop()!;
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

                if (
                    vNode.getText() === null &&
                    domNode.getText() !== "" &&
                    domNode.getText() !== "null"
                ) {
                    throw new Error(
                        "vNode.getText() === null && domNode.getText() !== ''"
                    );
                }

                if (vNode.getText() && vNode.getText() !== domNode.getText()) {
                    throw new Error("vNode.getText() !== domNode.getText()");
                }
            }
            vDomStack.push(...vNode.getChildren());
            domStack.push(...domNode.getChildren());
        }
        return true;
    }
}
