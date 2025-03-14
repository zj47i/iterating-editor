import { VDomNode } from "../vdom/vdom-node";
import { VDomNodeType } from "../vdom/vdom-node.enum";
import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandHandler } from "./command.handler.interface";
import { DomNode } from "../dom/dom-node";

export class CommandHandlerEnter implements CommandHandler {
    constructor(
        private editorDom: DomNode,
        private editorVDomNode: VDomNode,
        private sync: Synchronizer
    ) {}

    determine() {}

    handle(event: KeyboardEvent): void {
        event.preventDefault();
        const selection = getSelection();
        if (selection.anchorNode.nodeType === Node.TEXT_NODE) {
            if (!(selection.anchorNode instanceof Text)) {
                console.error("anchorNode is not Text");
                return;
            }
            this.textNodeEnter$(selection, selection.anchorNode);
        } else if (
            selection.anchorNode instanceof HTMLElement &&
            selection.anchorNode.nodeName === "P"
        ) {
            this.paragraphEnter$(
                selection,
                DomNode.fromExistingElement(selection.anchorNode)
            );
        }
    }

    private paragraphEnter$(selection: Selection, paragraph: DomNode) {
        console.info("paragraphEnter$");
        const vParagraph = this.sync.findVDomNodeFrom(paragraph);
        const newVParagraph = new VDomNode(VDomNodeType.PARAGRAPH);
        this.sync.addNewNextSiblings(vParagraph, [newVParagraph]);
        const range = document.createRange();
        range.setStart(paragraph.getNextSibling().getElement(), 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    private textNodeEnter$(selection: Selection, textNode: Text) {
        console.info("textNodeEnter$");
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
            const spanVDomNode = this.sync.findVDomNodeFrom(span);

            if (cursorPosition === 0) {
                this.sync.remove(span, spanVDomNode);
                return;
            }

            const former = span
                .getElement()
                .textContent.slice(0, cursorPosition);
            const latter = span.getElement().textContent.slice(cursorPosition);

            this.sync.setText(spanVDomNode, former);
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
            range.setStart(newSpan.getElement(), 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}
