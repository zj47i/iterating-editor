import { StateNode } from "../state-node/state-node";

export class DomElement {
    static remove(parent: HTMLElement, element: HTMLElement) {
        parent.removeChild(element);
    }

    static createBr(): HTMLElement {
        return document.createElement("br");
    }
    static createParagraph(): HTMLElement {
        return document.createElement("p");
    }

    static createSpan(): HTMLElement {
        return document.createElement("span");
    }

    static from(stateNode: StateNode): HTMLElement {
        if (stateNode.type === "span") {
            return DomElement.createSpan();
        } else if (stateNode.type === "paragraph") {
            return DomElement.createParagraph();
        }
        console.error("unknown type: ", stateNode.type);
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

    static isEmpty(element: HTMLElement) {
        return element.innerHTML === "";
    }
}
