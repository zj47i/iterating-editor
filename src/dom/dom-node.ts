import { EditorNode } from "../interface/editor-node.interface";
import { TextFormat } from "../enum/text-format";
import { DomVDomConverter } from "../shared/dom-vdom-converter";
import { VDomNode } from "../vdom/vdom-node";

/**
 * DomNode: Manages actual DOM elements and their manipulation
 * Responsibilities:
 * - Real DOM element lifecycle management
 * - DOM tree structure manipulation
 * - Style and formatting operations
 * - Browser integration and event handling
 */
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

    /**
     * Factory method to create a paragraph DOM element
     */
    public static createParagraph(): DomNode {
        return new DomNode(document.createElement("p"));
    }

    /**
     * Factory method to create a span DOM element
     */
    public static createSpan(textNode?: Text): DomNode {
        const span = new DomNode(document.createElement("span"));
        if (textNode) {
            span.appendTextNode(textNode);
        }
        return span;
    }

    /**
     * Create a DomNode from a VDomNode (delegated to converter)
     * @deprecated Use DomVDomConverter.createDomFromVDom instead
     */
    public static from(vdomNode: VDomNode): DomNode {
        return DomVDomConverter.createDomFromVDom(vdomNode);
    }

    /**
     * Create a complete DOM tree from a VDOM tree (delegated to converter)
     * @deprecated Use DomVDomConverter.createDomTreeFromVDom instead
     */
    public static fromVdom(vdomRoot: VDomNode): DomNode {
        return DomVDomConverter.createDomTreeFromVDom(vdomRoot);
    }

    /**
     * Constructor: Creates a DomNode wrapper around an HTML element
     * Uses WeakMap to ensure singleton pattern for each DOM element
     */
    constructor(private element: HTMLElement) {
        const domNode = DomNode.instances.get(element);
        if (domNode) {
            return domNode;
        }
        this.element = element;
        this.nodeName = element.nodeName;
        DomNode.instances.set(element, this);
    }

    /**
     * Insert a DOM node before a reference node
     */
    private insertBefore(newDomNode: DomNode, referenceDomNode: DomNode) {
        if (!referenceDomNode) {
            this.element.insertBefore(newDomNode.element, null);
            return;
        }
        this.element.insertBefore(newDomNode.element, referenceDomNode.element);
    }

    /**
     * Append a text node to this DOM element
     */
    private appendTextNode(textNode: Text): void {
        this.element.appendChild(textNode);
    }

    /**
     * Get the HTML tag name of this DOM element
     */
    public getNodeName(): string {
        return this.nodeName;
    }

    /**
     * Apply text formatting to this DOM element
     */
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

    /**
     * Get the text content of this DOM element (for span elements)
     */
    public getText(): string {
        if (this.element.nodeName !== "SPAN") {
            throw new Error("element is not span");
        }
        if (this.element.textContent === null) {
            throw new Error("textContent is null");
        }
        return this.element.textContent;
    }

    /**
     * Get the current text formatting of this DOM element
     */
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

    /**
     * Attach a child DOM node at the specified position
     */
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

    /**
     * Attach a child DOM node at the end
     */
    public attachLast(node: DomNode): void {
        this.attach(node, this.getChildren().length);
    }

    /**
     * Detach a child DOM node
     */
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

    /**
     * Get previous sibling DOM node
     */
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

    /**
     * Get all child DOM nodes (excluding BR elements)
     */
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

    /**
     * Get next sibling DOM node
     */
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

    /**
     * Add multiple sibling DOM nodes after this node
     */
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

    /**
     * Get the underlying HTML element
     */
    public getElement(): HTMLElement {
        return this.element;
    }

    /**
     * Get the parent DOM node
     */
    public getParent(): DomNode | null {
        if (this.element.parentElement === null) {
            return null;
        }
        return DomNode.fromExistingElement(this.element.parentElement);
    }

    /**
     * Absorb all children from another DOM node
     */
    public absorb(other: DomNode): void {
        for (const child of other.getChildren()) {
            other.detach(child);
            this.attachLast(child);
        }
        const otherParent = other.getParent();
        if (otherParent) otherParent.detach(other);
    }

    /**
     * Empty this DOM node of all content
     */
    public empty(): void {
        this.element.innerHTML = "";
    }

    /**
     * Check if this DOM node is empty
     */
    public isEmpty(): boolean {
        if (
            this.element.nodeName === "P" &&
            this.element.innerHTML === "<br>"
        ) {
            return true;
        }
        return this.element.innerHTML === "";
    }

    /**
     * Find path from this DomNode to the editor root
     * Returns array of child indices ordered from this node up to root
     * Example: [2, 0, 1] means: this node is the 2nd child of its parent, 
     * that parent is the 0th child of its parent, etc.
     */
    public findPathToRoot(): number[] {
        const path: number[] = [];
        let node: DomNode = this;
        while (node.getElement().id !== "@editor") {
            const parent = node.getParent();
            if (!parent) {
                console.log(node);
                throw new Error("parent is null");
            }
            const index = parent.getChildren().indexOf(node);
            path.push(index);
            node = parent;
        }
        return path;
    }

    /**
     * Find DomNode from a DOM element or text node
     * For text nodes, returns the parent span's DomNode
     */
    public static findFromElement(element: Node): DomNode | null {
        if (element.nodeType === Node.ELEMENT_NODE) {
            return DomNode.instances.get(element as HTMLElement) || null;
        }
        // For text nodes, find the parent span
        if (element.nodeType === Node.TEXT_NODE && element.parentElement) {
            return DomNode.instances.get(element.parentElement) || null;
        }
        return null;
    }
}
