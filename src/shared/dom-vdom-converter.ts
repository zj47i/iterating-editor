/**
 * Converter utilities for transforming between DOM and VDOM nodes
 * Separates conversion logic from the main node classes
 */

import { DomNode } from "../dom/dom-node";
import { VDomNode } from "../vdom/vdom-node";
import { VDomNodeType } from "../vdom/vdom-node.enum";

/**
 * Handles conversion between DOM and VDOM nodes
 */
export class DomVDomConverter {
    /**
     * Create a DomNode from a VDomNode
     */
    static createDomFromVDom(vdomNode: VDomNode): DomNode {
        if (vdomNode.type === VDomNodeType.SPAN) {
            const text = vdomNode.getText();
            if (text === null) {
                return DomNode.createSpan();
            } else {
                return DomNode.createSpan(document.createTextNode(text));
            }
        } else if (vdomNode.type === VDomNodeType.PARAGRAPH) {
            const paragraph = DomNode.createParagraph();
            paragraph.getElement().innerHTML = "<br>";
            return paragraph;
        }
        throw new Error(`Unknown vdom node type: ${vdomNode.type}`);
    }

    /**
     * Create a complete DOM tree from a VDOM tree
     */
    static createDomTreeFromVDom(vdomRoot: VDomNode): DomNode {
        const domRoot = DomVDomConverter.createDomFromVDom(vdomRoot);
        const nodeMap = new Map<number, DomNode>();
        nodeMap.set(vdomRoot.id, domRoot);

        const stack: VDomNode[] = [vdomRoot];

        while (stack.length > 0) {
            const currentV = stack.pop()!;
            const currentD = nodeMap.get(currentV.id)!;

            for (const childV of currentV.getChildren()) {
                const childD = DomVDomConverter.createDomFromVDom(childV);
                currentD.attachLast(childD);
                nodeMap.set(childV.id, childD);
                stack.push(childV);
            }
        }

        return domRoot;
    }

    /**
     * Create a VDomNode from an HTML element
     */
    static createVDomFromElement(element: HTMLElement): VDomNode {
        if (element.nodeName === "P") {
            return new VDomNode(VDomNodeType.PARAGRAPH);
        }
        if (element.nodeName === "SPAN") {
            if (!element.textContent) {
                throw new Error("textContent is null");
            }
            return VDomNode.createVSpan(element.textContent);
        }
        throw new Error(`Unknown element type: ${element.nodeName}`);
    }

    /**
     * Create a complete VDOM tree from a DOM element
     */
    static createVDomTreeFromElement(element: HTMLElement): VDomNode {
        const vdomRoot = DomVDomConverter.createVDomFromElement(element);
        
        // Recursively convert children
        const childElements = Array.from(element.children)
            .filter(child => child.nodeName !== "BR")
            .filter(child => child instanceof HTMLElement) as HTMLElement[];
        
        for (const childElement of childElements) {
            const childVDom = DomVDomConverter.createVDomTreeFromElement(childElement);
            vdomRoot.attachLast(childVDom);
        }
        
        return vdomRoot;
    }
}