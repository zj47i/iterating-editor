import { StateNode } from "../state-node/state-node";
import { StateNodeType } from "../state-node/state-node.enum";
import { Synchronizer } from "../syncronizer/syncronizer";
import { CommandHandler } from "./command.handler.interface";

export class CommandHandlerBackspace implements CommandHandler {
    constructor(
        private editorDom: HTMLElement,
        private editorStateNode: StateNode,
        private sync: Synchronizer
    ) {}

    determine() {}

    handler(event: KeyboardEvent): void {
        const selection = getSelection();
        if (selection.anchorNode.nodeType === Node.TEXT_NODE) {
            if (!(selection.anchorNode instanceof Text)) {
                console.error("anchorNode is not Text");
                return;
            }
            this.textNodeBackspace$(selection, selection.anchorNode, event);
        }
        if (selection.anchorNode.nodeName === "P") {
            event.preventDefault();
        }
    }

    private textNodeBackspace$(selection: Selection, textNode: Text, event: KeyboardEvent) {
        console.info("textNodeBackspace$");
        console.log(textNode.textContent.length)
        if (!(textNode instanceof Text)) {
            console.error("textNode is not Text");
            return;
        }
        if (textNode.textContent.length > 1) {
            console.log("textNode.textContent.length > 1")
            console.log(123);
            requestAnimationFrame(() => {
                const span = textNode.parentElement;
                this.sync.syncSpanStateNode(span);
            });
        } 
        
        if (textNode.textContent.length === 1) {
            console.log("textNode.textContent.length === 1")
            const span = textNode.parentElement;
            const paragraph = span.parentElement;
            const parent = paragraph.parentElement;
            const spanStateNode = this.sync.findStateNodeMatchingElement(span);
            this.sync.remove(span, spanStateNode);
            const range = document.createRange();
            range.setStart(paragraph, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            event.preventDefault();
        }
    }
}
