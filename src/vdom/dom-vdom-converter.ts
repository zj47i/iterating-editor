import { DomNode } from "../dom/dom-node";
import { VDomNode } from "./vdom-node";
import { VDomNodeType } from "./vdom-node.enum";

/**
 * Utility class for converting between DOM and VDom nodes
 */
export class DomVDomConverter {
    /**
     * Creates a VDomNode from an HTMLElement
     * @param element HTML element to convert
     * @returns VDomNode representation
     */
    public static fromHtmlElement(element: HTMLElement): VDomNode {
        if (element.nodeName === "P") {
            return new VDomNode(VDomNodeType.PARAGRAPH);
        }
        if (element.nodeName === "SPAN") {
            if (!element.textContent) {
                throw new Error("textContent is null");
            }
            const vSpan = VDomNode.createVSpan(element.textContent);
            return vSpan;
        }
        throw new Error("unknown element");
    }

    /**
     * Creates a DomNode from a VDomNode
     * @param vdomNode VDomNode to convert
     * @returns DomNode representation
     */
    public static fromVDomNode(vdomNode: VDomNode): DomNode {
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

    /**
     * Builds a complete DOM tree from a VDom tree
     * @param vdomRoot Root VDomNode
     * @returns Root DomNode of the constructed tree
     */
    public static buildDomTree(vdomRoot: VDomNode): DomNode {
        const domRoot = DomVDomConverter.fromVDomNode(vdomRoot);
        const nodeMap = new Map<number, DomNode>();
        nodeMap.set(vdomRoot.id, domRoot);

        const stack: VDomNode[] = [vdomRoot];

        while (stack.length > 0) {
            const currentV = stack.pop()!;
            const currentD = nodeMap.get(currentV.id)!;

            for (const childV of currentV.getChildren()) {
                const childD = DomVDomConverter.fromVDomNode(childV);
                currentD.attachLast(childD);
                nodeMap.set(childV.id, childD);
                stack.push(childV);
            }
        }

        return domRoot;
    }
}