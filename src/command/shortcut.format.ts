import { DomNode } from "../dom/dom-node.ts";
import { TextFormat } from "../enum/text-format.ts";
import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { VDomNode } from "../vdom/vdom-node.ts";
import { CommandBase } from "./command.base.ts";
import { SelectionStateMachine } from "../state-machine/selection.state-machine.ts";
import { range, rangeText } from "./selection/range.ts";

export class ShortcutFormat extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(
        textFormat: TextFormat,
        selectionStateMachine: SelectionStateMachine
    ) {
        console.info("ShortcutFormat$");
        const { startContainer, startOffset, endContainer, endOffset } =
            selectionStateMachine.getState();

        if (startContainer.parentElement === null) {
            throw new Error("startContainer.parentElement is null");
        }
        if (endContainer.parentElement === null) {
            throw new Error("endContainer.parentElement is null");
        }
        const startSpan = DomNode.fromExistingElement(
            startContainer.parentElement
        );
        const endSpan = DomNode.fromExistingElement(endContainer.parentElement);
        const startVSpan = this.sync.findVDomNodeFrom(startSpan);
        const endVSpan = this.sync.findVDomNodeFrom(endSpan);

        if (startSpan === endSpan) {
            const text = startSpan.getElement().textContent;
            if (!text) {
                throw new Error("text is empty");
            }
            const formerText = text.slice(0, startOffset);
            const selectedText = text.slice(startOffset, endOffset);
            const latterText = text.slice(endOffset);

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
                range(selectedSpan.getElement());
            });
        } else {
            const vSpans = VDomNode.findVDomNodesBetween(
                startVSpan,
                endVSpan
            ).filter((vdomNode) => vdomNode.type === "span");

            // vSpans[0]
            if (startContainer.textContent === null) {
                throw new Error("startContainer.textContent is null");
            }
            const startText = startContainer.textContent;
            const startNonSelectedText = startText.slice(0, startOffset);
            const startSelectedText = startText.slice(startOffset);

            const startSelectedVSpan = VDomNode.createVSpan(startSelectedText);
            this.sync.addNewNextSiblings(startVSpan, [startSelectedVSpan]);
            this.sync.setText(startVSpan, startNonSelectedText);
            this.sync.format(startSelectedVSpan, textFormat);

            // vSpans[1 ~ n-2]
            for (let i = 1; i < vSpans.length - 1; i++) {
                this.sync.format(vSpans[i], textFormat);
            }

            // vSpans[n-1]
            if (endContainer.textContent === null) {
                throw new Error("endContainer.textContent is null");
            }
            const endText = endContainer.textContent;
            const endSelectedText = endText.slice(0, endOffset);
            const endNonSelectedText = endText.slice(endOffset);

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

                const startSelectedTextnode =
                    startSelectedSpan.getElement().firstChild;
                if (!(startSelectedTextnode instanceof Text)) {
                    throw new Error("startSelectedTextnode is not Text");
                }
                const endSelectedText = endSelectedSpan.getElement().firstChild;
                if (!(endSelectedText instanceof Text)) {
                    throw new Error("endSelectedText is not Text");
                }

                rangeText(
                    startSelectedTextnode,
                    0,
                    endSelectedText,
                    endSelectedText.length
                );
            });
        }
    }
}
