import { StateNode } from "./state-node";

export class Synchronizer {
    constructor(private dom: HTMLElement, private state: StateNode) {}

    syncDom() {
        if (this.state.type === 'root' && this.dom.id !== '@editor') {
            console.error("root node must be @editor");
            return;
        }
        if (this.state.type === 'paragraph') {

        }
        if (this.state.type === 'span') {

        }
        if (this.state.children.length > 0 && this.dom.children.length === 0) {
            this.appendElement(this.dom, this.state.children);
        }
        
        for (let i = 0; i < this.state.children.length; i++) {
            const state = this.state.children[i];
            const element = this.dom.children[i] as HTMLElement;
            new Synchronizer(element, state).syncDom();
        }
    }

    appendElement(dom: HTMLElement, states: StateNode[]) {
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
