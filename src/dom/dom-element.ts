import { StateNode } from "../state-node/state-node";

export class DomElement {
    static removeFrom(parent: HTMLElement, element: HTMLElement) {
        parent.removeChild(element);
    }
    
    static remove(element: HTMLElement) {
        element.remove();
    }

    static children(element: HTMLElement): HTMLElement[] {
        return Array.from(element.children) as HTMLElement[];
    }

    static createBr(): HTMLElement {
        return document.createElement("br");
    }
    static createParagraph(): HTMLElement {
        return document.createElement("p");
        // p.style.minHeight = "1em";
        // return p;
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

    static empty(element: HTMLElement) {
        element.innerHTML = "";
    }

    static isEmpty(element: HTMLElement) {
        return element.innerHTML === "";
    }
}
