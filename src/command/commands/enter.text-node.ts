import { VDomNode } from "../../vdom/vdom-node";
import { VDomNodeType } from "../../vdom/vdom-node.enum";
import { Synchronizer } from "../../syncronizer/syncronizer";
import { DomNode } from "../../dom/dom-node";
import { CommandBase } from "../command.base";
import { EditorSelectionObject } from "../../editor/editor.selection";

export class EnterTextNode extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(selection: EditorSelectionObject, textNode: Text) {
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
        const cursorPosition = selection.anchorOffset;

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
            const range = document.createRange();
            range.setStart(newP.getElement(), 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            const newSpan = nextSiblingOfParagraph.getChildren()[0];
            if (newSpan === undefined) {
                throw new Error("newSpan is undefined");
            }
            const textNode = newSpan.getElement().firstChild;
            if (!(textNode instanceof Text)) {
                throw new Error("textNode is not Text");
            }
            const range = document.createRange();
            range.setStart(textNode, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}
