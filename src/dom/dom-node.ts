import { EditorNode } from "../interface/editor-node.interface";
import { TextFormat } from "../enum/text-format";
import { VDomNode } from "../vdom/vdom-node";

export class DomNode implements EditorNode<DomNode> {
    static instances = new WeakMap<HTMLElement, DomNode>();
    private nodeName: string;

    constructor(private element: HTMLElement) {
        if (DomNode.instances.has(element)) {
            return DomNode.instances.get(element);
        }
        this.element = element;
        this.nodeName = element.nodeName;
        DomNode.instances.set(element, this);
    }

    private insertBefore(newDomNode: DomNode, referenceDomNode: DomNode) {
        if (!referenceDomNode) {
            this.element.insertBefore(newDomNode.element, undefined);
            return;
        }
        this.element.insertBefore(newDomNode.element, referenceDomNode.element);
    }
    
    public getNodeName(): string {
        return this.nodeName;
    }
    
    public setFormat(format: TextFormat): void {
        if (format === TextFormat.BOLD) {
            this.element.style.fontWeight = "bold";
            return;
        }
        if (format === TextFormat.ITALIC) {
            this.element.style.fontStyle = "italic";
            return;
        }
        if (format === TextFormat.UNDERLINE) {
            this.element.style.textDecoration = "underline";
            return;
        }

        this.element.style.fontStyle = format;
    }

    public getText(): string {
        return this.element.textContent;
    }

    public getFormats(): TextFormat[] {
        const formats: TextFormat[] = [];
        if (this.element.style.fontWeight === "bold") {
            formats.push(TextFormat.BOLD);
        }
        if (this.element.style.fontStyle === "italic") {
            formats.push(TextFormat.ITALIC);
        }
        if (this.element.style.textDecoration === "underline") {
            formats.push(TextFormat.UNDERLINE);
        }
        return formats;
    }

    public attach(node: DomNode, at: number): void {
        if (
            this.element.nodeName === "P" &&
            this.element.innerHTML === "<br>"
        ) {
            this.empty();
        }
        const currentChild = this.getChildren()[at];
        this.insertBefore(node, currentChild);
    }

    public attachLast(node: DomNode): void {
        this.attach(node, this.getChildren().length);
    }

    private appendTextNode(textNode: Text): void {
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
        return Array.from(this.element.children)
            .filter((child) => child.nodeName !== "BR")
            .map((child) => {
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

    detach(node: DomNode): DomNode {
        const at = this.getChildren().indexOf(node);
        if (at === -1) {
            console.error("node is not child")
        }
        node.element.remove();
        return node;
    }

    public static createParagraph(): DomNode {
        return new DomNode(document.createElement("p"));
    }

    public static createSpan(textNode?: Text): DomNode {
        const span = new DomNode(document.createElement("span"));
        if (textNode) {
            span.appendTextNode(textNode);
        }
        return span;
    }

    public static from(vdomNode: VDomNode): DomNode {
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

    absorb(other: DomNode) {
        while (other.getChildren().length > 0) {
            const child = other.getChildren().shift();
            this.attachLast(child);
        }
        const parent = other.getParent();
        parent.detach(other);
    }

    empty() {
        this.element.innerHTML = "";
    }

    isEmpty() {
        if (
            this.element.nodeName === "P" &&
            this.element.innerHTML === "<br>"
        ) {
            return true;
        }
        return this.element.innerHTML === "";
    }
}
