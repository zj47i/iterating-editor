import { DomNode } from "../dom/dom-node";
import { TextFormat } from "../enum/text-format.enum";
import { VDomNode } from "../vdom/vdom-node";
import diff from "fast-diff";

export class Synchronizer {
    bold(vSpan: VDomNode) {
        vSpan.setFormat(TextFormat.BOLD);
        const span = this.findDomNodeFrom(vSpan);
        span.setFormat(TextFormat.BOLD);
    }

    constructor(private dom: DomNode, private vdom: VDomNode) {}

    private matchType(element: HTMLElement, vdomNode: VDomNode) {
        if (element.id === "@editor" && vdomNode.type !== "root") {
            return false;
        }
        if (element.nodeName === "P" && vdomNode.type !== "paragraph") {
            return false;
        }

        if (element.nodeName === "SPAN" && vdomNode.type !== "span") {
            return false;
        }

        return true;
    }

    setText(spanVDomNode: VDomNode, text: string) {
        spanVDomNode.setText(text);
        const span = this.findDomNodeFrom(spanVDomNode);
        span.getElement().textContent = text;
    }

    setSpanVDomNodeText(spanVDomNode: VDomNode, textContent: string) {
        spanVDomNode.setText(textContent);
    }

    mergeParagraphs(
        previousParagraphVDomNode: VDomNode,
        paragraphVDomNode: VDomNode
    ) {
        const paragraph = this.findDomNodeFrom(paragraphVDomNode);
        const previousParagraph = this.findDomNodeFrom(
            previousParagraphVDomNode
        );
        if (!previousParagraph) {
            console.error("previousParagraph is undefined");
        }
        if (!(previousParagraph.getElement() instanceof HTMLElement)) {
            console.error("previousParagraph's element is not HTMLElement");
            return;
        }
        previousParagraphVDomNode.absorb(paragraphVDomNode);
        previousParagraph.absorb(paragraph);
    }

    appendNewVDomNode(vParent: VDomNode, vChild: VDomNode) {
        const parent = this.findDomNodeFrom(vParent);
        if (vParent.type === "paragraph" && vParent.isEmpty()) {
            parent.empty();
        }
        const child = DomNode.from(vChild);
        vParent.append(vChild);
        parent.append(child);
    }

    appendNewDomNode(parent: DomNode, child: DomNode) {
        const vParent = this.findVDomNodeFrom(parent);
        if (vParent.type === "paragraph" && vParent.isEmpty()) {
            parent.empty();
        }
        const vChild = VDomNode.from(child.getElement());
        parent.append(child);
        vParent.append(vChild);
    }

    remove(element: DomNode, vdomNode: VDomNode) {
        vdomNode.remove();
        element.remove();
    }

    addNewNextSiblings(vdomNode: VDomNode, siblings: VDomNode[]) {
        const domNode = this.findDomNodeFrom(vdomNode);
        vdomNode.addNextSiblings(siblings);
        const siblingDomNodes = siblings.map((sibling) =>
            DomNode.from(sibling)
        );
        domNode.addNextSiblings(siblingDomNodes);
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

    findVDomNodeIndexPathToRoot(vdomNode: VDomNode): number[] {
        const path: number[] = [];
        while (vdomNode.type !== "root") {
            if (!vdomNode.parent) {
                console.error("vdomNode.parent is undefined");
                return [];
            }
            const index = vdomNode.parent.children.indexOf(vdomNode);
            path.push(index);
            vdomNode = vdomNode.parent;
        }
        return path;
    }

    findVDomNodeFrom(domElement: DomNode): VDomNode {
        const element = domElement.getElement();
        const path = this.findElementIndexPathToRoot(element);
        if (path.length === 0) {
            return this.vdom;
        }
        let vdomNode = this.vdom;
        for (let i = path.length - 1; i >= 0; i--) {
            vdomNode = vdomNode.children[path[i]];
        }
        return vdomNode;
    }

    findDomNodeFrom(vdomNode: VDomNode): DomNode {
        const path = this.findVDomNodeIndexPathToRoot(vdomNode);
        if (path.length === 0) {
            return this.dom;
        }
        let element = this.dom;
        for (let i = path.length - 1; i >= 0; i--) {
            const e = element.getChildren()[path[i]];
            if (!e) {
                console.error("element is undefined");
                return null;
            }
            if (!(e.getElement() instanceof HTMLElement)) {
                console.error("element is not HTMLElement");
                return null;
            }
            element = e;
        }
        return element;
    }
}
