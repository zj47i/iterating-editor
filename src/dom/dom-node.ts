import { EditorNode } from "../editor-node.interface";
import { TextFormat } from "../enum/text-format.enum";
import { VDomNode } from "../vdom/vdom-node";
import { VDomNodeType } from "../vdom/vdom-node.enum";

export class DomNode implements EditorNode<DomNode> {

    static instances = new WeakMap<HTMLElement, DomNode>();
    nodeName: string;

    constructor(private element: HTMLElement) {
        // 이미 해당 요소에 대한 인스턴스가 존재하면 기존 인스턴스를 반환
        if (DomNode.instances.has(element)) {
            return DomNode.instances.get(element);
        }
        this.element = element;
        this.nodeName = element.nodeName;
        DomNode.instances.set(element, this);
    }

    insertBefore(newDomNode: DomNode, referenceDomNode: DomNode) {
        this.element.insertBefore(newDomNode.element, referenceDomNode.element);
    }
    setFormat(format: TextFormat): void {
        if (format === TextFormat.BOLD) {
            this.element.style.fontWeight = "bold";
            return;
        }
        this.element.style.fontStyle = format;
    }
    append(node: DomNode): void {
        this.element.appendChild(node.element);
    }
    appendTextNode(textNode: Text): void {
        this.element.appendChild(textNode);
    }
    getPreviousSibling(): DomNode {
        const element = this.element.previousElementSibling;
        if (!element) {
            return null;
        }
        if (!(element instanceof HTMLElement)) {
            console.error("element is not HTMLElement");
            return null;
        }
        return DomNode.fromExistingElement(element);
    }
    getChildren(): DomNode[] {
        return Array.from(this.element.children).map((child) => {
            if (!(child instanceof HTMLElement)) {
                console.error("child is not HTMLElement");
                return null;
            }

            return DomNode.fromExistingElement(child);
        });
    }
    getNextSibling(): DomNode {
        const element = this.element.nextElementSibling;
        if (!element) {
            return null;
        }
        if (!(element instanceof HTMLElement)) {
            console.error("element is not HTMLElement");
            return null;
        }
        return DomNode.fromExistingElement(element);
    }
    addNextSiblings(siblings: DomNode[]): void {
        const parentElement = this.element.parentElement;
        let target = this.element;
        siblings.forEach((sibling) => {
            const siblingElement = sibling.element;
            parentElement.insertBefore(siblingElement, target.nextSibling);
            target = siblingElement;
        });
    }

    public getElement() {
        return this.element;
    }

    remove() {
        this.element.remove();
    }

    static createParagraph(): DomNode {
        return new DomNode(document.createElement("p"));
    }

    static createSpan(textNode?: Text): DomNode {
        const span = new DomNode(document.createElement("span"));
        if (textNode) {
            span.appendTextNode(textNode);
        }
        return span;
    }

    static from(vdomNode: VDomNode): DomNode {
        if (vdomNode.type === "span") {
            return DomNode.createSpan();
        } else if (vdomNode.type === "paragraph") {
            const paragraph = DomNode.createParagraph();
            paragraph.getElement().innerHTML = "<br>";
            return paragraph;
        }
        console.error("unknown type: ", vdomNode.type);
    }

    static fromExistingElement(element: HTMLElement): DomNode {
        if (DomNode.instances.has(element)) {
            return DomNode.instances.get(element);
        }
        console.error("element is not registered", element.outerHTML);
    }

    getParent(): DomNode {
        return DomNode.fromExistingElement(this.element.parentElement);
    }

    absorb(latter: DomNode) {
        const children = Array.from(latter.element.children);
        children.forEach((child) => {
            this.element.appendChild(child);
        });
        latter.remove();
    }

    empty() {
        this.element.innerHTML = "";
    }

    isEmpty() {
        return this.element.innerHTML === "";
    }
}
