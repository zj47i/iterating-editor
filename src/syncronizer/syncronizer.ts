import { DomElement } from "../dom/dom-element";
import { StateNode } from "../state-node/state-node";
import diff from "fast-diff";

export class Synchronizer {
    constructor(private dom: HTMLElement, private state: StateNode) {}

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
        }
    }

    append(
        parentElement: HTMLElement,
        parentStateNode: StateNode,
        stateNode: StateNode
    ) {
        parentStateNode.appendNode(stateNode);
        const element = DomElement.from(stateNode);
        parentElement.insertBefore(
            element,
            parentElement.children[parentStateNode.children.length - 1]
        );
        this.syncElement(element, stateNode);
    }

    remove(element: HTMLElement, state: StateNode) {
        const parentElement = element.parentElement;
        const parentStateNode = state.parent;

        state.delete();
        this.syncElement(element, state);
        this.syncElement(parentElement, parentStateNode);
    }

    addNextSiblings(
        element: HTMLElement,
        stateNode: StateNode,
        siblings: StateNode[]
    ) {
        stateNode.addNextSiblings(siblings);
        const parentElement = element.parentElement;
        let target = element;
        // add siblings at index, siblings is array, and add as stable
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

    findStateNodeMatchingElement(element: HTMLElement): StateNode {
        const path = this.findElementIndexPathToRoot(element);
        let state = this.state;
        for (let i = path.length - 1; i >= 0; i--) {
            state = state.children[path[i]];
        }
        return state;
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
