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

    // syncEditor() {
    //     const stack: [HTMLElement, StateNode][] = [[this.dom, this.state]];

    //     while (stack.length > 0) {
    //         const [element, state] = stack.pop();

    //         this.syncElement(element, state);

    //         // insert, modify
    //         for (let i = 0; i < state.children.length; i++) {
    //             const childState = state.children[i];
    //             if (childState.diff === undefined) {
    //                 continue;
    //             }

    //             if (childState.diff === StateNodeDiff.DELETE) {
    //                 childState.delete();
    //                 this.dom.removeChild(this.dom.children[i]);
    //                 i--;
    //                 continue;
    //             }

    //             if (childState.diff === StateNodeDiff.INSERT) {
    //                 this.dom.insertBefore(
    //                     DomElement.from(childState),
    //                     this.dom.children[i]
    //                 );
    //             }

    //             const childElement = this.dom.children[i];
    //             if (!(childElement instanceof HTMLElement)) {
    //                 console.error(
    //                     "childElement is not HTMLElement: ",
    //                     childElement
    //                 );
    //                 return;
    //             }
    //             stack.push([childElement, childState]);
    //         }
    //     }

    //     // 자식 dom 생성
    //     if (this.state.children.length > 0 && this.dom.children.length === 0) {
    //         const newDomElements = this.state.children.map(DomElement.from);
    //         newDomElements.forEach((element) => {
    //             this.dom.appendChild(element);
    //         });
    //     }

    //     for (let i = 0; i < this.state.children.length; i++) {
    //         const state = this.state.children[i];
    //         const element = this.dom.children[i];
    //         if (!(element instanceof HTMLElement)) {
    //             console.error("element is not HTMLElement: ", element);
    //             return;
    //         }
    //         new Synchronizer(element, state).syncEditor();
    //     }
    // }

    syncEditor() {
        const stack: [HTMLElement, StateNode][] = [[this.dom, this.state]];

        while (stack.length > 0) {
            const [element, state] = stack.pop();
            this.syncElement(element, state);

            // insert, modify
            for (let i = 0; i < state.children.length; i++) {
                const childState = state.children[i];

                if (childState.diff === StateNodeDiff.DELETE) {
                    childState.delete();
                    element.removeChild(element.children[i]);
                    i--;
                    continue;
                }

                if (childState.diff === StateNodeDiff.INSERT) {
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

    syncElement(element: HTMLElement, state: StateNode) {
        // 현재 element가 state와 일치하는지 확인
        if (!this.matchType(element, state)) {
            console.error("type of element and state does not match");
            return;
        }

        if (state.diff === undefined) {
            return;
        }

        if (state.type === "root") {
            return;
        }

        if (state.type === "paragraph") {
            if (state.isEmpty()) {
                element.innerHTML = "<br>";
            } else {
                if (DomElement.elementHasBreakOnly(element)) {
                    DomElement.empty(element);
                }
            }
        }

        if (state.type === "span") {
            element.textContent = state.getText();
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

    syncStateNodeText() {
        const anchorNode = window.getSelection().anchorNode;
        const span = anchorNode.parentElement;
        const state = this.findStateNodeMatchingElement(span);

        if (!state.getText()) {
            state.setText(anchorNode.textContent);
            return;
        }

        const d = diff(state.getText(), anchorNode.textContent);

        state.setText(
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
