import { DomElement } from "../dom/dom-element";
import { StateNode } from "../state-node/state-node";
import diff from "fast-diff";
import { StateNodeDiff } from "../state-node/state-node.enum";

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

    syncEditor() {
        const stack: [HTMLElement, StateNode][] = [[this.dom, this.state]];

        while (stack.length > 0) {
            const [element, state] = stack.pop();
            const diff = state.diff;

            this.syncElement(element, state);

            // insert, modify
            for (let i = 0; i < state.children.length; i++) {
                const childState = state.children[i];
                if (childState.diff === StateNodeDiff.DELETED) {
                    continue;
                }

                if (childState.diff === StateNodeDiff.INSERTED) {
                    if (
                        element.nodeName === "P" &&
                        element.children[0].tagName === "BR"
                    ) {
                        element.removeChild(element.children[0]);
                    }
                    element.insertBefore(
                        DomElement.from(childState),
                        element.children[i]
                    );
                }

                const childElement = element.children[i];

                if (!(childElement instanceof HTMLElement)) {
                    console.error(
                        "childElement is not HTMLElement: ",
                        childElement
                    );
                    return;
                }
                stack.push([childElement, childState]);
            }
        }
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

        if (state.isEmpty() && !DomElement.isEmpty(element)) {
            DomElement.empty(element);
        }

        if (state.type === "span") {
            element.textContent = state.getText();
        }

        if (state.type === "paragraph" && state.diff === StateNodeDiff.INSERTED) {
            element.appendChild(DomElement.createBr());
        }

        if (state.type === "paragraph" && state.isEmpty()) {
            const newParagraph = DomElement.createParagraph();
            const parent = element.parentElement;
            // replace paragraph with newParagraph
            parent.insertBefore(newParagraph, element);
            parent.removeChild(element);
            newParagraph.appendChild(DomElement.createBr());
        }

        state.diff = undefined;
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
