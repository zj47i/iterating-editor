import { DomElement } from "../dom/dom-element";
import { StateNode } from "../state-node/state-node";
import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandHandler } from "./command.handler.interface";

export class CommandHandlerInput implements CommandHandler {
    constructor(
        private editorDom: HTMLElement,
        private editorStateNode: StateNode,
        private sync: Synchronizer
    ) {}

    determine() {}

    handler(event: KeyboardEvent): void {
        const selection = getSelection();
        const element = selection.anchorNode;
        if (element.nodeType === Node.TEXT_NODE) {
            if (!(element instanceof Text)) {
                console.error("element is not Text");
                return;
            }
            const textNode = element;
            const parent = textNode.parentElement;
            if (parent.nodeName === "P") {
                console.info("paragraph");
                this.paragraphInput$(textNode, parent, selection);
            }
        }
    }

    private paragraphInput$(
        textNode: Text,
        paragraph: HTMLElement,
        selection: Selection
    ) {
        console.info("paragraphInput$");
        const newSpan = DomElement.createSpan();
        newSpan.appendChild(textNode);
        const paragraphStateNode =
            this.sync.findStateNodeMatchingElement(paragraph);
        this.sync.appendElement(paragraphStateNode, paragraph, newSpan);
        const range = document.createRange();
        range.setStart(textNode, 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
