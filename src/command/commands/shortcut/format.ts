import { DomNode } from "../../../dom/dom-node";
import { TextFormat } from "../../../enum/text-format";
import { Synchronizer } from "../../../syncronizer/syncronizer";
import { VDomNode } from "../../../vdom/vdom-node";
import { VDomNodeType } from "../../../vdom/vdom-node.enum";
import { CommandBase } from "../../command.base";

export class ShortcutFormat extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(textFormat: TextFormat, selection: Selection) {
        console.log("ShortcutFormat");
        let { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
        let startNode: Node,
            endNode: Node,
            startNodeOffset: number,
            endNodeOffset: number;
        if (anchorNode.compareDocumentPosition(focusNode) === 0) {
            if (anchorOffset === focusOffset) {
                return;
            }
            if (anchorOffset < focusOffset) {
                [startNode, endNode, startNodeOffset, endNodeOffset] = [
                    anchorNode,
                    focusNode,
                    anchorOffset,
                    focusOffset,
                ];
            } else {
                [startNode, endNode, startNodeOffset, endNodeOffset] = [
                    focusNode,
                    anchorNode,
                    focusOffset,
                    anchorOffset,
                ];
            }
        } else if (
            anchorNode.compareDocumentPosition(focusNode) ===
            Node.DOCUMENT_POSITION_FOLLOWING
        ) {
            [startNode, endNode, startNodeOffset, endNodeOffset] = [
                anchorNode,
                focusNode,
                anchorOffset,
                focusOffset,
            ];
        } else if (
            anchorNode.compareDocumentPosition(focusNode) ===
            Node.DOCUMENT_POSITION_PRECEDING
        ) {
            [startNode, endNode, startNodeOffset, endNodeOffset] = [
                focusNode,
                anchorNode,
                focusOffset,
                anchorOffset,
            ];
        }

        const startSpan = DomNode.fromExistingElement(startNode.parentElement);
        const endSpan = DomNode.fromExistingElement(endNode.parentElement);
        const startVSpan = this.sync.findVDomNodeFrom(startSpan);
        const endVSpan = this.sync.findVDomNodeFrom(endSpan);

        if (startSpan === endSpan) {
            const text = startSpan.getElement().textContent;
            const formerText = text.slice(0, startNodeOffset);
            const selectedText = text.slice(startNodeOffset, endNodeOffset);
            const latterText = text.slice(endNodeOffset);

            const formerSpanVDomNode = startVSpan;
            const selectedSpanVDomNode = new VDomNode(VDomNodeType.SPAN);
            const latterSpanVDomNode = new VDomNode(VDomNodeType.SPAN);
            this.sync.addNewNextSiblings(formerSpanVDomNode, [
                selectedSpanVDomNode,
                latterSpanVDomNode,
            ]);

            this.sync.setText(formerSpanVDomNode, formerText);
            this.sync.setText(selectedSpanVDomNode, selectedText);
            this.sync.setText(latterSpanVDomNode, latterText);

            this.sync.format(selectedSpanVDomNode, textFormat);

            requestAnimationFrame(() => {
                const selectedSpan =
                    this.sync.findDomNodeFrom(selectedSpanVDomNode);
                const range = document.createRange();
                range.selectNode(selectedSpan.getElement());
                selection.removeAllRanges();
                selection.addRange(range);
            });
        } else {
            const vSpans = VDomNode.findVDomNodesBetween(
                startVSpan,
                endVSpan
            ).filter((vdomNode) => vdomNode.type === "span");

            // vSpans[0]
            const startText = anchorNode.textContent;
            const startNonSelectedText = startText.slice(0, startNodeOffset);
            const startSelectedText = startText.slice(startNodeOffset);

            const startSelectedVSpan = new VDomNode(VDomNodeType.SPAN);
            this.sync.addNewNextSiblings(startVSpan, [startSelectedVSpan]);
            this.sync.setText(startVSpan, startNonSelectedText);
            this.sync.setText(startSelectedVSpan, startSelectedText);
            this.sync.format(startSelectedVSpan, textFormat);

            // vSpans[1 ~ n-2]
            for (let i = 1; i < vSpans.length - 1; i++) {
                this.sync.format(vSpans[i], textFormat);
            }

            // vSpans[n-1]
            const endText = focusNode.textContent;
            const endSelectedText = endText.slice(0, endNodeOffset);
            const endNonSelectedText = endText.slice(endNodeOffset);

            const endSelectedVSpan = endVSpan;
            const endNonSelectedVSpan = new VDomNode(VDomNodeType.SPAN);
            this.sync.addNewNextSiblings(endSelectedVSpan, [
                endNonSelectedVSpan,
            ]);
            this.sync.setText(endSelectedVSpan, endSelectedText);
            this.sync.setText(endNonSelectedVSpan, endNonSelectedText);
            this.sync.format(endSelectedVSpan, textFormat);

            requestAnimationFrame(() => {
                const startSelectedSpan =
                    this.sync.findDomNodeFrom(startSelectedVSpan);
                const endSelectedSpan =
                    this.sync.findDomNodeFrom(endSelectedVSpan);

                const range = document.createRange();
                range.setStart(startSelectedSpan.getElement().firstChild, 0);
                range.setEnd(
                    endSelectedSpan.getElement().firstChild,
                    endSelectedText.length
                );
                selection.removeAllRanges();
                selection.addRange(range);
            });
        }
    }
}
