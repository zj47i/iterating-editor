import { StateNode } from "../state-node/state-node";
import diff from "fast-diff";

export class Synchronizer {
    constructor(private dom: HTMLElement, private state: StateNode) {}

    public syncDom() {
        if (this.state.type === "root" && this.dom.id !== "@editor") {
            console.error("root node must be @editor");
            return;
        }
        if (this.state.type === "paragraph") {
        }
        if (this.state.type === "span") {
        }
        if (this.state.children.length > 0 && this.dom.children.length === 0) {
            this.appendElement(this.dom, this.state.children);
        }

        for (let i = 0; i < this.state.children.length; i++) {
            const state = this.state.children[i];
            const element = this.dom.children[i];
            if (!(element instanceof HTMLElement)) {
                console.error("element is not HTMLElement");
                return;
            }
            new Synchronizer(element, state).syncDom();
        }
    }

    findElementIndexPathFromRoot(element: HTMLElement): number[] {
        const path: number[] = [];
        while (element.id !== "@editor") {
            if (!element.parentElement) {
                console.error("element.parentElement is null");
                return [];
            }
            const index = Array.from(element.parentElement.children).indexOf(
                element
            );
            path.push(index);
            element = element.parentElement;
        }
        return path;
    }

    findStateByPath(indexPath: number[]): StateNode {
        let state = this.state;
        for (let i = 0; i < indexPath.length; i++) {
            state = state.children[indexPath[i]];
        }
        return state;
    }

    findStateMatchingElement(element: HTMLElement): StateNode {
        const path = this.findElementIndexPathFromRoot(element);
        return this.findStateByPath(path);
    }

    syncStateText() {
        const anchorNode = window.getSelection().anchorNode;
        const state = this.findStateMatchingElement(anchorNode.parentElement);

        if (!state.text) {
            state.text = anchorNode.textContent;
            return;
        }

        const d = diff(state.text, anchorNode.textContent);

        state.text = d.reduce((acc, item) => {
            if (item[0] === 0) {
                return acc.concat(item[1]);
            }
            if (item[0] === 1) {
                return acc.concat(item[1]);
            }
            return acc;
        }, "");
    }

    public appendElement(dom: HTMLElement, states: StateNode[]) {
        states.forEach((state) => {
            if (state.type === "paragraph") {
                const p = document.createElement("p");
                dom.appendChild(p);
                console.info("p appended");
            }
            if (state.type === "span") {
                const span = document.createElement("span");
                span.textContent = state.text;
                dom.appendChild(span);
                console.info("span appended");
            }
        });
    }
}
