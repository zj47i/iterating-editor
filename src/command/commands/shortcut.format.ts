import { DomNode } from "../../dom/dom-node";
import { EditorSelectionObject } from "../../editor.selection";
import { TextFormat } from "../../enum/text-format";
import { Synchronizer } from "../../syncronizer/syncronizer";
import { VDomNode } from "../../vdom/vdom-node";
import { VDomNodeType } from "../../vdom/vdom-node.enum";
import { CommandBase } from "../command.base";
import { startEndTextNodes } from "./selection/startend";

export class ShortcutFormat extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(textFormat: TextFormat, selection: EditorSelectionObject) {
        console.log("ShortcutFormat$");
        const { endNode, endNodeOffset, startNode, startNodeOffset } =
            startEndTextNodes(selection);

        if (startNode.parentElement === null) {
            throw new Error("startNode.parentElement is null");
        }
        if (endNode.parentElement === null) {
            throw new Error("endNode.parentElement is null");
        }
        const startSpan = DomNode.fromExistingElement(startNode.parentElement);
        const endSpan = DomNode.fromExistingElement(endNode.parentElement);
        const startVSpan = this.sync.findVDomNodeFrom(startSpan);
        const endVSpan = this.sync.findVDomNodeFrom(endSpan);

        if (startSpan === endSpan) {
            const text = startSpan.getElement().textContent;
            if (!text) {
                throw new Error("text is empty");
            }
            const formerText = text.slice(0, startNodeOffset);
            const selectedText = text.slice(startNodeOffset, endNodeOffset);
            const latterText = text.slice(endNodeOffset);

            const formerSpanVDomNode = startVSpan;

            this.sync.setText(formerSpanVDomNode, formerText);
            const selectedSpanVDomNode = VDomNode.createVSpan(selectedText);
            const latterSpanVDomNode = VDomNode.createVSpan(latterText);
            this.sync.addNewNextSiblings(formerSpanVDomNode, [
                selectedSpanVDomNode,
                latterSpanVDomNode,
            ]);

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
            if (startNode.textContent === null) {
                throw new Error("startNode.textContent is null");
            }
            const startText = startNode.textContent;
            const startNonSelectedText = startText.slice(0, startNodeOffset);
            const startSelectedText = startText.slice(startNodeOffset);

            const startSelectedVSpan = VDomNode.createVSpan(startSelectedText);
            this.sync.addNewNextSiblings(startVSpan, [startSelectedVSpan]);
            this.sync.setText(startVSpan, startNonSelectedText);
            this.sync.format(startSelectedVSpan, textFormat);

            // vSpans[1 ~ n-2]
            for (let i = 1; i < vSpans.length - 1; i++) {
                this.sync.format(vSpans[i], textFormat);
            }

            // vSpans[n-1]
            if (endNode.textContent === null) {
                throw new Error("endNode.textContent is null");
            }
            const endText = endNode.textContent;
            const endSelectedText = endText.slice(0, endNodeOffset);
            const endNonSelectedText = endText.slice(endNodeOffset);

            const endSelectedVSpan = endVSpan;
            const endNonSelectedVSpan =
                VDomNode.createVSpan(endNonSelectedText);
            this.sync.addNewNextSiblings(endSelectedVSpan, [
                endNonSelectedVSpan,
            ]);
            this.sync.setText(endSelectedVSpan, endSelectedText);
            this.sync.format(endSelectedVSpan, textFormat);

            requestAnimationFrame(() => {
                const startSelectedSpan =
                    this.sync.findDomNodeFrom(startSelectedVSpan);
                const endSelectedSpan =
                    this.sync.findDomNodeFrom(endSelectedVSpan);

                const range = document.createRange();
                const startSelectedTextnode =
                    startSelectedSpan.getElement().firstChild;
                if (!(startSelectedTextnode instanceof Text)) {
                    throw new Error("startSelectedTextnode is not Text");
                }
                const endSelectedText = endSelectedSpan.getElement().firstChild;
                if (!(endSelectedText instanceof Text)) {
                    throw new Error("endSelectedText is not Text");
                }

                range.setStart(startSelectedTextnode, 0);
                range.setEnd(endSelectedText, endSelectedText.length);
                selection.removeAllRanges();
                selection.addRange(range);
            });
        }
    }
}
