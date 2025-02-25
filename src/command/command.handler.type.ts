import { DomElement } from "../dom/dom-element";
import { StateNode } from "../state-node/state-node";
import { StateNodeType } from "../state-node/state-node.enum";
import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandHandler } from "./command.handler.interface";

export class CommandHandlerType implements CommandHandler {
    constructor(
        private editorDom: HTMLElement,
        private editorStateNode: StateNode,
        private sync: Synchronizer
    ) {}

    determine() {}

    handler(event: KeyboardEvent): void {
        const selection = getSelection();
        if (selection.anchorNode.nodeName === "P") {
            // event.preventDefault();
            if (
                !(selection.anchorNode instanceof HTMLElement) ||
                selection.anchorNode.nodeName !== "P"
            ) {
                console.error("paragraph is not paragraph element");
                return;
            }
            event.preventDefault();
            this.paragraphType$(selection, selection.anchorNode, event.key);
        }

        if (selection.anchorNode.nodeType === Node.TEXT_NODE) {
            // event.preventDefault();
            if (!(selection.anchorNode instanceof Text)) {
                console.error("anchorNode is not Text");
                return;
            }
            this.textNodeType$(selection.anchorNode, event);
        }
    }

    private paragraphType$(
        selection: Selection,
        paragraph: HTMLElement,
        data: string
    ) {
        console.info("paragraphTyping$");
        const paragraphStateNode =
            this.sync.findStateNodeMatchingElement(paragraph);
        const newSpanStateNode = new StateNode(StateNodeType.SPAN);
        newSpanStateNode.setText(data);
        if (paragraphStateNode.isEmpty()) {
            paragraph.innerHTML = "";
        }
        this.sync.append(paragraph, paragraphStateNode, newSpanStateNode)

        const span = paragraph.firstElementChild;
        const textNode = span.firstChild;
        const range = document.createRange();
        range.setStart(textNode, 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    private textNodeType$(textNode: Text, event: KeyboardEvent) {
        console.info("textNodeType$");
        requestAnimationFrame(() => {
            const span = textNode.parentElement;
            this.sync.syncSpanStateNode(span);
        });
    }
}
