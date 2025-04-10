import { VDomNode } from "../../vdom/vdom-node";
import { VDomNodeType } from "../../vdom/vdom-node.enum";
import { Synchronizer } from "../../syncronizer/syncronizer";
import { DomNode } from "../../dom/dom-node";
import { CommandBase } from "../command.base";

export class EnterTextNode extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(selection: Selection, textNode: Text) {
        console.info("EnterTextNode$");
        const span = DomNode.fromExistingElement(textNode.parentElement);
        const paragraph = span.getParent();

        const vParagraph = this.sync.findVDomNodeFrom(paragraph);

        const newVParagraph = new VDomNode(VDomNodeType.PARAGRAPH);
        this.sync.addNewNextSiblings(vParagraph, [newVParagraph]);

        if (!(paragraph.getNextSibling().getElement() instanceof HTMLElement)) {
            console.error("nextSibling is not HTMLElement");
            return;
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

            const newVSpan = new VDomNode(VDomNodeType.SPAN);
            this.sync.appendNewVDomNode(newVParagraph, newVSpan);
            this.sync.setText(newVSpan, latter);
        }

        if (cursorPosition === textLength) {
            const newP = paragraph.getNextSibling();
            const range = document.createRange();
            range.setStart(newP.getElement(), 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            const newSpan = paragraph.getNextSibling().getChildren()[0];
            const range = document.createRange();
            range.setStart(newSpan.getElement().firstChild, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}
