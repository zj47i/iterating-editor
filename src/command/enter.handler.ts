import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { DomNode } from "../dom/dom-node.ts";
import { VDomNode } from "../vdom/vdom-node.ts";
import { VDomNodeType } from "../vdom/vdom-node.enum.ts";
import { position } from "./selection/position.ts";

export class EnterHandler {
    constructor(private sync: Synchronizer) {}

    handleParagraph(paragraph: DomNode) {
        // 단락에서 Enter 처리
        const vParagraph = this.sync.findVDomNodeFrom(paragraph);
        const newVParagraph = new VDomNode(VDomNodeType.PARAGRAPH);
        this.sync.addNewNextSiblings(vParagraph, [newVParagraph]);
        const nextSiblingParagraph = paragraph.getNextSibling();
        if (!nextSiblingParagraph) {
            throw new Error("nextSiblingParagraph is null");
        }
        position(nextSiblingParagraph.getElement(), 0);
    }

    handleTextNodeLineUp(textNode: Text, cursorPosition: number) {
        console.info("EnterTextNode$");
        if (!(textNode.parentElement instanceof HTMLElement)) {
            throw new Error("parentElement is not HTMLElement");
        }
        if (textNode.textContent === null) {
            throw new Error("textContent is null");
        }
        const span = DomNode.fromExistingElement(textNode.parentElement);
        const paragraph = span.getParent();
        if (!paragraph) {
            throw new Error("paragraph is null");
        }

        const vParagraph = this.sync.findVDomNodeFrom(paragraph);

        const newVParagraph = new VDomNode(VDomNodeType.PARAGRAPH);
        this.sync.addNewNextSiblings(vParagraph, [newVParagraph]);

        const newParagraph = this.sync.findDomNodeFrom(newVParagraph);
        const nextSiblingOfParagraph = paragraph.getNextSibling();
        if (
            nextSiblingOfParagraph === null ||
            nextSiblingOfParagraph !== newParagraph
        ) {
            throw new Error("nextSibling might not be made");
        }

        const textLength = textNode.textContent.length;

        if (cursorPosition !== textLength) {
            const vSpan = this.sync.findVDomNodeFrom(span);

            const former = span.getText().slice(0, cursorPosition);
            const latter = span.getText().slice(cursorPosition);

            if (cursorPosition === 0) {
                this.sync.remove(vSpan);
            } else {
                this.sync.setText(vSpan, former);
            }

            const newVSpan = VDomNode.createVSpan(latter);
            this.sync.appendNewVDomNode(newVParagraph, newVSpan);
        }

        if (cursorPosition === textLength) {
            const newP = nextSiblingOfParagraph;
            position(newP.getElement(), 0);
        } else {
            const newSpan = nextSiblingOfParagraph.getChildren()[0];
            if (newSpan === undefined) {
                throw new Error("newSpan is undefined");
            }
            const textNode = newSpan.getElement().firstChild;
            if (!(textNode instanceof Text)) {
                throw new Error("textNode is not Text");
            }
            position(textNode, 0);
        }
    }
}
