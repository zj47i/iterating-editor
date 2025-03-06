import { DomElement } from "../../../dom/dom-element";
import { StateNode } from "../../../vdom/state-node";
import { StateNodeType } from "../../../vdom/state-node.enum";
import { Synchronizer } from "../../../syncronizer/syncronizer";
import { CommandHandler } from "../../command.handler.interface";

export class ShortcutHandler implements CommandHandler {
    constructor(
        private editorDom: HTMLElement,
        private editorStateNode: StateNode,
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

    private getElement(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.parentElement;
        } else {
            if (!(node instanceof HTMLElement)) {
                console.error("node is not HTMLElement");
                return;
            }
            return node;
        }
    }

    private bold$(event: KeyboardEvent) {
        console.log("bold$");
        event.preventDefault();
        const selection = document.getSelection();
        let { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
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
            [anchorNode, focusNode] = [focusNode, anchorNode];
            [anchorOffset, focusOffset] = [focusOffset, anchorOffset];
        }

        const anchorSpan = this.getElement(anchorNode);
        const focusSpan = this.getElement(focusNode);
        const anchorSpanStateNode =
            this.sync.findStateNodeMatchingElement(anchorSpan);
        const focusSpanStateNode =
            this.sync.findStateNodeMatchingElement(focusSpan);

        if (anchorSpan === focusSpan) {
            const text = anchorSpan.textContent;
            const formerText = text.slice(0, anchorOffset);
            const selectedText = text.slice(anchorOffset, focusOffset);
            const latterText = text.slice(focusOffset);

            const formerSpanStateNode = anchorSpanStateNode;
            this.sync.setText(formerSpanStateNode, formerText);
            const selectedSpanStateNode = new StateNode(StateNodeType.SPAN);
            selectedSpanStateNode.setText(selectedText);
            const latterSpanStateNode = new StateNode(StateNodeType.SPAN);
            latterSpanStateNode.setText(latterText);
            this.sync.addNextSiblings(formerSpanStateNode, [
                selectedSpanStateNode,
                latterSpanStateNode,
            ]);
            this.sync.bold(selectedSpanStateNode);

            requestAnimationFrame(() => {
                const node = anchorSpan.nextSibling;
                const range = document.createRange();
                range.selectNode(node);
                selection.removeAllRanges();
                selection.addRange(range);
            });
        } else {
            const spanStateNodes = StateNode.findStatesBetween(
                anchorSpanStateNode,
                focusSpanStateNode
            ).filter((stateNode) => stateNode.type === "span");

            const firstSpanText = anchorNode.textContent;
            const firstSpanFormerText = firstSpanText.slice(0, anchorOffset);
            const firstSpanSelectedText = firstSpanText.slice(anchorOffset);

            const firstSpanStateNode = spanStateNodes[0];
            this.sync.setText(firstSpanStateNode, firstSpanFormerText);
            const firstSelectedSpanStateNode = new StateNode(
                StateNodeType.SPAN
            );
            firstSelectedSpanStateNode.setText(firstSpanSelectedText);
            this.sync.addNextSiblings(firstSpanStateNode, [
                firstSelectedSpanStateNode,
            ]);
            this.sync.bold(firstSelectedSpanStateNode);

            const lastSpanText = focusNode.textContent;
            const lastSpanSelectedText = lastSpanText.slice(0, focusOffset);
            const lastSpanLatterText = lastSpanText.slice(focusOffset);

            const lastSpanStateNode = spanStateNodes[spanStateNodes.length - 1];
            this.sync.setText(lastSpanStateNode, lastSpanSelectedText);
            const lastLatterSpanStateNode = new StateNode(StateNodeType.SPAN);
            lastLatterSpanStateNode.setText(lastSpanLatterText);
            this.sync.addNextSiblings(lastSpanStateNode, [
                lastLatterSpanStateNode,
            ]);
            this.sync.bold(lastSpanStateNode);

            for (let i = 1; i < spanStateNodes.length - 1; i++) {
                this.sync.bold(spanStateNodes[i]);
            }

            requestAnimationFrame(() => {
                const startNode = anchorSpan.nextSibling.firstChild;
                const endNode = focusSpan.firstChild;
                const range = document.createRange();
                range.setStart(startNode, 0);
                range.setEnd(endNode, endNode.textContent.length - 1);
                selection.removeAllRanges();
                selection.addRange(range);
            });
        }
    }
}
