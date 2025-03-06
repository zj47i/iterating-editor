import { DomElement } from "../dom/dom-element";
import { StateNode } from "../vdom/state-node";
import diff from "fast-diff";
import { StateNodeTextFormat } from "../vdom/state-node.enum";

export class Synchronizer {
    bold(span: StateNode) {
        span.setFormat(StateNodeTextFormat.BOLD);
        const element = this.findElementMatchingStateNode(span);
        this.syncElement(element, span);
    }

    constructor(private dom: HTMLElement, private vdom: StateNode) {}

    private matchType(element: HTMLElement, state: StateNode) {
        if (element.id === "@editor" && state.type !== "root") {
            return false;
        }
        if (element.nodeName === "P" && state.type !== "paragraph") {
            return false;
        }

        if (element.nodeName === "SPAN" && state.type !== "span") {
            return false;
        }

        return true;
    }

    setText(spanStateNode: StateNode, text: string) {
        spanStateNode.setText(text);
        const span = this.findElementMatchingStateNode(spanStateNode);
        span.textContent = text;
    }

    setSpanStateNodeText(spanStateNode: StateNode, textContent: string) {
        spanStateNode.setText(textContent);
    }

    mergeParagraphs(
        previousParagraphStateNode: StateNode,
        paragraphStateNode: StateNode,
        paragraph: HTMLElement
    ) {
        const previousParagraph = paragraph.previousElementSibling;
        if (!previousParagraph) {
            console.error("previousParagraph is undefined");
        }
        if (!(previousParagraph instanceof HTMLElement)) {
            console.error("previousParagraph is not HTMLElement");
            return;
        }
        previousParagraphStateNode.absorb(paragraphStateNode);
        DomElement.merge(previousParagraph, paragraph);
    }

    private syncElement(element: HTMLElement, state: StateNode) {
        if (state.type === "root") {
            return;
        }
        // 현재 element가 state와 일치하는지 확인
        if (!this.matchType(element, state)) {
            console.error("type of element and state does not match");
            return;
        }

        if (state.isEmpty()) {
            DomElement.empty(element);
            if (state.type === "paragraph") {
                element.appendChild(DomElement.createBr());
            }
        }

        if (!state.parent) {
            DomElement.remove(element);
            return;
        }

        if (state.type === "span") {
            element.textContent = state.getText();
            if (state.format) {
                state.format.forEach((format) => {
                    if (format === "bold") {
                        element.style.fontWeight = "bold";
                    }
                    if (format === "italic") {
                        element.style.fontStyle = "italic";
                    }
                });
            }
        }
    }

    private syncStateNode(state: StateNode, element: HTMLElement) {
        if (element.nodeName === "SPAN") {
            state.setText(element.textContent);
        }
    }

    appendStateNode(stateNode: StateNode, childStateNode: StateNode) {
        const element = this.findElementMatchingStateNode(stateNode);
        if (stateNode.type === "paragraph" && stateNode.isEmpty()) {
            element.innerHTML = "";
        }
        stateNode.appendNode(childStateNode);
        const childElement = DomElement.from(childStateNode);
        element.insertBefore(
            childElement,
            element.children[stateNode.children.length - 1]
        );
        this.syncElement(childElement, childStateNode);
    }

    appendElement(
        parentStateNode: StateNode,
        parentElement: HTMLElement,
        childElement: HTMLElement
    ) {
        if (parentStateNode.type === "paragraph" && parentStateNode.isEmpty()) {
            parentElement.innerHTML = "";
        }
        parentElement.appendChild(childElement);
        const childStateNode = StateNode.from(childElement);
        parentStateNode.appendNode(childStateNode);
        this.syncStateNode(childStateNode, childElement);
    }

    remove(element: HTMLElement, state: StateNode) {
        const parentElement = element.parentElement;
        const parentStateNode = state.parent;

        state.remove();
        this.syncElement(element, state);
        this.syncElement(parentElement, parentStateNode);
    }

    addNextSiblings(stateNode: StateNode, siblings: StateNode[]) {
        stateNode.addNextSiblings(siblings);
        const element = this.findElementMatchingStateNode(stateNode);
        const parentElement = element.parentElement;
        let target = element;
        siblings.forEach((sibling) => {
            const siblingElement = DomElement.from(sibling);
            parentElement.insertBefore(siblingElement, target.nextSibling);
            target = siblingElement;
            this.syncElement(siblingElement, sibling);
        });
    }

    findElementIndexPathToRoot(element: HTMLElement): number[] {
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

    findStateNodeIndexPathToRoot(stateNode: StateNode): number[] {
        const path: number[] = [];
        while (stateNode.type !== "root") {
            if (!stateNode.parent) {
                console.error("stateNode.parent is undefined");
                return [];
            }
            const index = stateNode.parent.children.indexOf(stateNode);
            path.push(index);
            stateNode = stateNode.parent;
        }
        return path;
    }

    findStateNodeMatchingElement(element: HTMLElement): StateNode {
        const path = this.findElementIndexPathToRoot(element);
        if (path.length === 0) {
            return this.vdom;
        }
        let state = this.vdom;
        for (let i = path.length - 1; i >= 0; i--) {
            state = state.children[path[i]];
        }
        return state;
    }

    findElementMatchingStateNode(stateNode: StateNode): HTMLElement {
        const path = this.findStateNodeIndexPathToRoot(stateNode);
        if (path.length === 0) {
            return this.dom;
        }
        let element = this.dom;
        for (let i = path.length - 1; i >= 0; i--) {
            const e = element.children[path[i]];
            if (!(e instanceof HTMLElement)) {
                console.error("element is not HTMLElement");
                return null;
            }
            element = e;
        }
        return element;
    }

    syncSpanStateNode(span: HTMLElement) {
        const spanState = this.findStateNodeMatchingElement(span);

        if (!spanState.getText()) {
            spanState.setText(span.textContent);
            return;
        }

        const d = diff(spanState.getText(), span.textContent);
        spanState.setText(
            d.reduce((acc, item) => {
                if (item[0] === 0) {
                    return acc.concat(item[1]);
                }
                if (item[0] === 1) {
                    return acc.concat(item[1]);
                }
                return acc;
            }, "")
        );
    }
}
