import { position } from "../command/selection/position";
import { DomNode } from "../dom/dom-node";
import { TextFormat } from "../enum/text-format";
import { VDomNode } from "../vdom/vdom-node";
import { VDomNodeType } from "../vdom/vdom-node.enum";
import { editScript } from "./algorithm/edit-script";
import { LCS } from "./algorithm/lcs";
import { HookBefore } from "./decorator/hook-before";
import { SelectionStateMachine, State } from "../state-machine/selection.state-machine";

import _ from "lodash";
import { UndoRedoManager } from "./undo-redo-manager";

export class Synchronizer {
    private undoRedoManager = new UndoRedoManager();
    private selectionStateMachine: SelectionStateMachine | null = null;

    constructor(private dom: DomNode, private vdom: VDomNode) {}

    public setSelectionStateMachine(selectionStateMachine: SelectionStateMachine) {
        this.selectionStateMachine = selectionStateMachine;
    }

    private getCurrentCursorPosition(): State | null {
        if (!this.selectionStateMachine) {
            return null;
        }
        
        return this.selectionStateMachine.getState();
    }

    private restoreCursorPosition(cursorPosition: State | null): void {
        if (!cursorPosition) {
            return;
        }

        try {
            // Since we rebuild the DOM, the original nodes don't exist anymore
            // We need to find the equivalent node in the new DOM structure
            if (cursorPosition.startContainer.nodeType === Node.TEXT_NODE) {
                // Find the equivalent text node in the rebuilt DOM
                const firstParagraph = this.dom.getElement().querySelector('p');
                if (firstParagraph) {
                    const firstSpan = firstParagraph.querySelector('span');
                    if (firstSpan && firstSpan.firstChild) {
                        const textNode = firstSpan.firstChild;
                        // Make sure the offset is valid for the text length
                        const maxOffset = textNode.textContent?.length || 0;
                        const safeOffset = Math.min(cursorPosition.startOffset, maxOffset);
                        position(textNode, safeOffset);
                        return;
                    }
                }
            }
            
            // Fallback: try to use the original node if it still exists
            if (this.isNodeInDOM(cursorPosition.startContainer)) {
                position(cursorPosition.startContainer, cursorPosition.startOffset);
            }
        } catch (error) {
            console.warn("Failed to restore cursor position:", error);
        }
    }

    private isNodeInDOM(node: Node): boolean {
        return document.contains(node);
    }

    private saveCurrentVdom(cursorPosition?: State | null) {
        const actualCursorPosition = cursorPosition !== undefined ? cursorPosition : this.getCurrentCursorPosition();
        
        // Create a deep copy of the cursor position to avoid mutation issues
        let cursorPositionCopy: State | null = null;
        if (actualCursorPosition) {
            cursorPositionCopy = {
                startContainer: actualCursorPosition.startContainer,
                startOffset: actualCursorPosition.startOffset,
                endContainer: actualCursorPosition.endContainer,
                endOffset: actualCursorPosition.endOffset,
                onEvent: actualCursorPosition.onEvent.bind(actualCursorPosition),
                getName: actualCursorPosition.getName.bind(actualCursorPosition)
            };
        }
        
        this.undoRedoManager.push(this.vdom.deepClone(), cursorPositionCopy);
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
        const subDom = DomNode.fromVdom(subVdom);
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
        editorElement.innerHTML = '';
        
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
            const domChild = DomNode.fromVdom(child);
            this.dom.attachLast(domChild);
        }
    }

    public undo() {
        const currentCursorPosition = this.getCurrentCursorPosition();
        
        const prevState = this.undoRedoManager.undo(this.vdom.deepClone(), currentCursorPosition);
        if (prevState) {
            this.replaceVdomDirectly(prevState.vdom);
            this.restoreCursorPosition(prevState.cursorPosition);
        }
    }

    public redo() {
        const currentCursorPosition = this.getCurrentCursorPosition();
        
        const nextState = this.undoRedoManager.redo(this.vdom.deepClone(), currentCursorPosition);
        if (nextState) {
            this.replaceVdomDirectly(nextState.vdom);
            this.restoreCursorPosition(nextState.cursorPosition);
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
        const child = DomNode.from(vChild);
        vParent.attachLast(vChild);
        parent.attachLast(child);
    }

    @HookBefore<Synchronizer>(Synchronizer.prototype.saveCurrentVdom)
    public appendNewVDomNode(vParent: VDomNode, vChild: VDomNode) {
        const parent = this.findDomNodeFrom(vParent);
        const child = DomNode.from(vChild);
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
            DomNode.from(sibling)
        );
        domNode.addNextSiblings(siblingDomNodes);
    }

    private findPathToRoot(element: HTMLElement): number[] {
        const path: number[] = [];
        while (element.id !== "@editor") {
            if (!element.parentElement) {
                // Handle case where element has been detached from DOM
                // Return empty path to indicate element is no longer in DOM tree
                console.warn("Element has been detached from DOM, returning empty path");
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
            const parent = vdomNode.getParent();
            if (!parent) {
                return [];
            }
            const index = parent.getChildren().indexOf(vdomNode);
            path.push(index);
            vdomNode = parent;
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
