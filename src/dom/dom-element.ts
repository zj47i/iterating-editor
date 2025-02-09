import { StateNode } from "../state-node/state-node";

export class DomElement {
    static createParagraph(): HTMLElement {
        const p = document.createElement("p");
        return  p;
    }

    static from(stateNode: StateNode): HTMLElement {
        if (stateNode.type === "span") {
            return document.createElement("span");
        }
        if (stateNode.type === "paragraph") {
            return DomElement.createParagraph();
        }
        return document.createElement(stateNode.type);
    }

    static elementHasBreakOnly(element: HTMLElement): boolean {
        return Array.from(element.childNodes).every(
            (node) =>
                node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR"
        );
    }

    static empty(element: HTMLElement) {
        element.innerHTML = "";
    }
}
