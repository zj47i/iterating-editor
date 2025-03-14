import { DomNode } from "../../../dom/dom-node";
import { VDomNode } from "../../../vdom/vdom-node";
import { VDomNodeType } from "../../../vdom/vdom-node.enum";
import { Synchronizer } from "../../../syncronizer/syncronizer";
import { CommandHandler } from "../../command.handler.interface";

export class ShortcutHandler implements CommandHandler {
    constructor(
        private editorDom: DomNode,
        private editorVDomNode: VDomNode,
        private sync: Synchronizer
    ) {}

    determine() {}

    handle(event: KeyboardEvent): void {
        console.log("shortcut");

        //if ctrl + b
        if (event.ctrlKey && event.key === "b") {
            this.bold$(event);
        }
    }

    private bold$(event: KeyboardEvent) {
        console.log("bold$");
        event.preventDefault();
        const selection = document.getSelection();
        let { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
        let startNode: Node,
            endNode: Node,
            startNodeOffset: number,
            endNodeOffset: number;
        if (
            selection.anchorNode === selection.focusNode &&
            selection.anchorOffset === selection.focusOffset
        ) {
            console.error("no selection");
            return;
        }

        if (
            anchorNode.compareDocumentPosition(focusNode) ===
            Node.DOCUMENT_POSITION_PRECEDING
        ) {
            [startNode, endNode, startNodeOffset, endNodeOffset] = [
                focusNode,
                anchorNode,
                focusOffset,
                anchorOffset,
            ];
        } else {
            [startNode, endNode, startNodeOffset, endNodeOffset] = [
                anchorNode,
                focusNode,
                anchorOffset,
                focusOffset,
            ];
        }

        const startSpan = DomNode.fromExistingElement(startNode.parentElement);
        const endSpan = DomNode.fromExistingElement(endNode.parentElement);
        const startSpanVDomNode = this.sync.findVDomNodeFrom(startSpan);
        const endSpanVDomNode = this.sync.findVDomNodeFrom(endSpan);

        if (startSpan === endSpan) {
            const text = startSpan.getElement().textContent;
            const formerText = text.slice(0, startNodeOffset);
            const selectedText = text.slice(startNodeOffset, endNodeOffset);
            const latterText = text.slice(endNodeOffset);

            const formerSpanVDomNode = startSpanVDomNode;
            const selectedSpanVDomNode = new VDomNode(VDomNodeType.SPAN);
            const latterSpanVDomNode = new VDomNode(VDomNodeType.SPAN);
            this.sync.addNewNextSiblings(formerSpanVDomNode, [
                selectedSpanVDomNode,
                latterSpanVDomNode,
            ]);

            this.sync.setText(formerSpanVDomNode, formerText);
            this.sync.setText(selectedSpanVDomNode, selectedText);
            this.sync.setText(latterSpanVDomNode, latterText);

            this.sync.bold(selectedSpanVDomNode);

            requestAnimationFrame(() => {
                const node = startSpan.getNextSibling().getElement();
                const range = document.createRange();
                range.selectNode(node);
                selection.removeAllRanges();
                selection.addRange(range);
            });
        } else {
            const spanVDomNodes = VDomNode.findStatesBetween(
                startSpanVDomNode,
                endSpanVDomNode
            ).filter((vdomNode) => vdomNode.type === "span");

            const firstSpanText = anchorNode.textContent;
            const firstSpanFormerText = firstSpanText.slice(0, startNodeOffset);
            const firstSpanSelectedText = firstSpanText.slice(startNodeOffset);

            const firstSpanVDomNode = spanVDomNodes[0];
            this.sync.setText(firstSpanVDomNode, firstSpanFormerText);
            const firstSelectedSpanVDomNode = new VDomNode(VDomNodeType.SPAN);
            firstSelectedSpanVDomNode.setText(firstSpanSelectedText);
            this.sync.addNewNextSiblings(firstSpanVDomNode, [
                firstSelectedSpanVDomNode,
            ]);
            this.sync.bold(firstSelectedSpanVDomNode);

            const lastSpanText = focusNode.textContent;
            const lastSpanSelectedText = lastSpanText.slice(0, endNodeOffset);
            const lastSpanLatterText = lastSpanText.slice(endNodeOffset);

            const lastSpanVDomNode = spanVDomNodes[spanVDomNodes.length - 1];
            this.sync.setText(lastSpanVDomNode, lastSpanSelectedText);
            const lastLatterSpanVDomNode = new VDomNode(VDomNodeType.SPAN);
            lastLatterSpanVDomNode.setText(lastSpanLatterText);
            this.sync.addNewNextSiblings(lastSpanVDomNode, [
                lastLatterSpanVDomNode,
            ]);
            this.sync.bold(lastSpanVDomNode);

            for (let i = 1; i < spanVDomNodes.length - 1; i++) {
                this.sync.bold(spanVDomNodes[i]);
            }

            requestAnimationFrame(() => {
                const startNode = startSpan
                    .getNextSibling()
                    .getElement().firstChild;
                const endNode = endSpan.getElement().firstChild;
                const range = document.createRange();
                range.setStart(startNode, 0);
                range.setEnd(endNode, endNode.textContent.length - 1);
                selection.removeAllRanges();
                selection.addRange(range);
            });
        }
    }
}
