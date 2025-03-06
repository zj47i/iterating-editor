import { StateNode } from "../vdom/state-node";
import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandHandler } from "./command.handler.interface";

export class CommandHandlerBackspace implements CommandHandler {
    constructor(
        private editorDom: HTMLElement,
        private editorStateNode: StateNode,
        private sync: Synchronizer
    ) {}

    determine() {}

    handle(event: KeyboardEvent): void {
        const selection = getSelection();
        if (
            selection.anchorNode.nodeType === Node.TEXT_NODE &&
            selection.anchorOffset === 0
        ) {
            if (!(selection.anchorNode instanceof Text)) {
                console.error("textNode is not Text");
                return;
            }
            this.pullUpLine$(selection, selection.anchorNode, event);
        }
        if (selection.anchorNode.nodeName === "P") {
            if (!(selection.anchorNode instanceof HTMLElement)) {
                console.error("anchorNode is not HTMLElement");
                return;
            }
            this.pullUpParagraphLine$(selection.anchorNode, event);
            // event.preventDefnault();
        }
    }

    private pullUpParagraphLine$(paragraph: HTMLElement, event: KeyboardEvent) {
        console.info("pullUpParagraphLine$");
        const paragraphStateNode =
            this.sync.findStateNodeMatchingElement(paragraph);

        const previousParagraphStateNode =
            paragraphStateNode.getPreviousSibling();
        if (!previousParagraphStateNode) {
            event.preventDefault();
            return;
        }
    }

    private pullUpLine$(
        selection: Selection,
        textNode: Text,
        event: KeyboardEvent
    ) {
        console.info("pullUpLine$");
        const span = textNode.parentElement;
        const paragraph = span.parentElement;
        const paragraphStateNode =
            this.sync.findStateNodeMatchingElement(paragraph);

        const previousParagraphStateNode =
            paragraphStateNode.getPreviousSibling();
        if (!previousParagraphStateNode) {
            event.preventDefault();
            return;
        }
        this.sync.mergeParagraphs(
            previousParagraphStateNode,
            paragraphStateNode,
            paragraph
        );
        const range = document.createRange();
        range.setStart(textNode, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
