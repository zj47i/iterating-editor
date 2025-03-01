import { StateNode } from "../state-node/state-node";
import { StateNodeType } from "../state-node/state-node.enum";
import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandHandler } from "./command.handler.interface";

export class CommandHandlerEnter implements CommandHandler {
    constructor(
        private editorDom: HTMLElement,
        private editorStateNode: StateNode,
        private sync: Synchronizer
    ) {}

    determine() {}

    handler(): void {
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
            this.paragraphEnter$(selection, selection.anchorNode);
        }
    }

    private paragraphEnter$(selection: Selection, paragraph: HTMLElement) {
        console.info("paragraphEnter$");
        const paragraphStateNode =
            this.sync.findStateNodeMatchingElement(paragraph);
        const newParagraphStateNode = new StateNode(StateNodeType.PARAGRAPH);
        this.sync.addNextSiblings(paragraphStateNode, [newParagraphStateNode]);
        const range = document.createRange();
        range.setStart(paragraph.nextElementSibling, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    private textNodeEnter$(selection: Selection, textNode: Text) {
        console.info("textNodeEnter$");
        const span = textNode.parentElement;
        const paragraph = span.parentElement;

        const paragraphStateNode =
            this.sync.findStateNodeMatchingElement(paragraph);

        const newParagraphStateNode = new StateNode(StateNodeType.PARAGRAPH);
        this.sync.addNextSiblings(paragraphStateNode, [newParagraphStateNode]);

        if (!(paragraph.nextElementSibling instanceof HTMLElement)) {
            console.error("nextSibling is not HTMLElement");
            return;
        }

        const textLength = textNode.textContent.length;
        const cursorPosition = selection.anchorOffset;

        if (cursorPosition !== textLength) {
            const spanStateNode = this.sync.findStateNodeMatchingElement(span);

            if (cursorPosition === 0) {
                this.sync.remove(span, spanStateNode);
                return;
            }

            const former = span.textContent.slice(0, cursorPosition);
            const latter = span.textContent.slice(cursorPosition);

            this.sync.setText(
                spanStateNode,
                former
            );
            const newSpanStateNode = new StateNode(StateNodeType.SPAN);
            this.sync.appendStateNode(newParagraphStateNode, newSpanStateNode);
            this.sync.setText(
                newSpanStateNode,
                latter
            );
        }

        if (cursorPosition === textLength) {
            const newP = paragraph.nextElementSibling;
            const range = document.createRange();
            range.setStart(newP, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            const newSpan = paragraph.nextElementSibling.firstElementChild;
            const range = document.createRange();
            range.setStart(newSpan, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}
