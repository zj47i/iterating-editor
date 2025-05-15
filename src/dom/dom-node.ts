import { EditorNode } from "../interface/editor-node.interface";
import { TextFormat } from "../enum/text-format";
import { VDomNode } from "../vdom/vdom-node";

export class DomNode implements EditorNode<DomNode> {
    private nodeName: string;

    static instances = new WeakMap<HTMLElement, DomNode>();

    static fromExistingElement(element: HTMLElement): DomNode {
        const domNode = DomNode.instances.get(element);
        if (domNode) {
            return domNode;
        }
        throw new Error("element is not DomNode");
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
            const text = vdomNode.getText();
            if (text === null) {
                return DomNode.createSpan();
            } else {
                return DomNode.createSpan(document.createTextNode(text));
            }
        } else if (vdomNode.type === "paragraph") {
            const paragraph = DomNode.createParagraph();
            paragraph.getElement().innerHTML = "<br>";
            return paragraph;
        }
        throw new Error("unknown vdom node type");
    }

    public static fromVdom(vdomRoot: VDomNode): DomNode {
        const domRoot = DomNode.from(vdomRoot);
        const nodeMap = new Map<number, DomNode>();
        nodeMap.set(vdomRoot.id, domRoot);

        const stack: VDomNode[] = [vdomRoot];

        while (stack.length > 0) {
            const currentV = stack.pop()!;
            const currentD = nodeMap.get(currentV.id)!;

            for (const childV of currentV.getChildren()) {
                const childD = DomNode.from(childV);
                currentD.attachLast(childD);
                nodeMap.set(childV.id, childD);
                stack.push(childV);
            }
        }

        return domRoot;
    }

    constructor(private element: HTMLElement) {
        const domNode = DomNode.instances.get(element);
        if (domNode) {
            return domNode;
        }
        this.element = element;
        this.nodeName = element.nodeName;
        DomNode.instances.set(element, this);
    }

    private insertBefore(newDomNode: DomNode, referenceDomNode: DomNode) {
        if (!referenceDomNode) {
            this.element.insertBefore(newDomNode.element, null);
            return;
        }
        this.element.insertBefore(newDomNode.element, referenceDomNode.element);
    }

    private appendTextNode(textNode: Text): void {
        this.element.appendChild(textNode);
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
        if (this.element.nodeName !== "SPAN") {
            throw new Error("element is not span");
        }
        if (this.element.textContent === null) {
            throw new Error("textContent is null");
        }
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
        if (node.getElement().parentElement) {
            throw new Error("node is already attached");
        }
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

    public detach(node: DomNode): DomNode {
        const at = this.getChildren().indexOf(node);
        if (at === -1) {
            throw new Error("node is not child");
        }
        node.element.remove();
        if (this.getNodeName() === "P" && this.isEmpty()) {
            this.element.innerHTML = "<br>";
        }
        return node;
    }

    public getPreviousSibling(): DomNode | null {
        const element = this.element.previousElementSibling;
        if (!element) {
            return null;
        }
        if (!(element instanceof HTMLElement)) {
            throw new Error("element is not HTMLElement");
        }
        return DomNode.fromExistingElement(element);
    }

    public getChildren(): DomNode[] {
        return Array.from(this.element.children)
            .filter((child) => child.nodeName !== "BR")
            .map((child) => {
                if (!(child instanceof HTMLElement)) {
                    throw new Error("child is not HTMLElement");
                }

                return DomNode.fromExistingElement(child);
            });
    }

    public getNextSibling(): DomNode | null {
        const element = this.element.nextElementSibling;
        if (!element) {
            return null;
        }
        if (!(element instanceof HTMLElement)) {
            throw new Error("element is not HTMLElement");
        }
        return DomNode.fromExistingElement(element);
    }

    public addNextSiblings(siblings: DomNode[]): void {
        const parentElement = this.element.parentElement;
        if (!parentElement) {
            throw new Error("parentElement is null");
        }
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

    public getParent(): DomNode | null {
        if (this.element.parentElement === null) {
            return null;
        }
        return DomNode.fromExistingElement(this.element.parentElement);
    }

    public absorb(other: DomNode) {
        for (const child of other.getChildren()) {
            other.detach(child);
            this.attachLast(child);
        }
        const otherParent = other.getParent();
        if (otherParent) otherParent.detach(other);
    }

    public empty() {
        this.element.innerHTML = "";
    }

    public isEmpty() {
        if (
            this.element.nodeName === "P" &&
            this.element.innerHTML === "<br>"
        ) {
            return true;
        }
        return this.element.innerHTML === "";
    }
}
