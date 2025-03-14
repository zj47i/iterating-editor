import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandHandler } from "./command.handler.interface";
import { DomNode } from "../dom/dom-node";
import { VDomNode } from "../vdom/vdom-node";

export class CommandHandlerBackspace implements CommandHandler {
    constructor(
        private editorDom: DomNode,
        private editorVDomNode: VDomNode,
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
            this.pullUpParagraphLine$(DomNode.fromExistingElement(selection.anchorNode), event);
            // event.preventDefnault();
        }
    }

    private pullUpParagraphLine$(paragraph: DomNode, event: KeyboardEvent) {
        console.info("pullUpParagraphLine$");
        const paragraphVDomNode = this.sync.findVDomNodeFrom(paragraph);

        const previousParagraphVDomNode =
            paragraphVDomNode.getPreviousSibling();
        if (!previousParagraphVDomNode) {
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
        const span = DomNode.fromExistingElement(textNode.parentElement);
        const paragraph = span.getParent();
        const paragraphVDomNode = this.sync.findVDomNodeFrom(paragraph);

        const previousParagraphVDomNode =
            paragraphVDomNode.getPreviousSibling();
        if (!previousParagraphVDomNode) {
            event.preventDefault();
            return;
        }
        this.sync.mergeParagraphs(
            previousParagraphVDomNode,
            paragraphVDomNode,
        );
        const range = document.createRange();
        range.setStart(textNode, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
