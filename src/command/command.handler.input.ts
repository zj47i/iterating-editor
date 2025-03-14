import { DomNode } from "../dom/dom-node";
import { VDomNode } from "../vdom/vdom-node";
import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandHandler } from "./command.handler.interface";

export class CommandHandlerInput implements CommandHandler {
    constructor(
        private editorDom: DomNode,
        private editorVDomNode: VDomNode,
        private sync: Synchronizer
    ) {}

    determine() {}

    handle(event: KeyboardEvent): void {
        const selection = getSelection();
        const element = selection.anchorNode;
        if (element.nodeType === Node.TEXT_NODE) {
            if (!(element instanceof Text)) {
                console.error("element is not Text");
                return;
            }
            const textNode = element;
            const parent = DomNode.fromExistingElement(textNode.parentElement);
            if (parent.nodeName === "P") {
                this.paragraphInput$(textNode, parent, selection);
                return;
            }

            if (parent.nodeName === "SPAN") {
                this.textNodeInput$(textNode, selection);
                return;
            }
        }
    }

    private paragraphInput$(
        textNode: Text,
        paragraph: DomNode,
        selection: Selection
    ) {
        console.info("paragraphInput$");
        const newSpan = DomNode.createSpan();
        newSpan.appendTextNode(textNode);
        this.sync.appendNewDomNode(paragraph, newSpan);
        const range = document.createRange();
        range.setStart(textNode, 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    private textNodeInput$(textNode: Text, selection: Selection) {
        console.info("textNodeInput$");
        const span = DomNode.fromExistingElement(textNode.parentElement);
        const spanVDomNode = this.sync.findVDomNodeFrom(span);
        this.sync.setSpanVDomNodeText(spanVDomNode, textNode.textContent);
    }
}
