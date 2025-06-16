import { DomNode } from "../../dom/dom-node";

export const range = (node: DomNode) => {
    const selection = window.getSelection();
    if (!selection) {
        throw new Error("No selection available");
    }
    const range = document.createRange();
    range.selectNode(node.getElement());
    selection.removeAllRanges();
    selection.addRange(range);
};

export const rangeText = (
    startNode: Text,
    startOffset: number,
    endNode: Text,
    endOffset: number
) => {
    const selection = window.getSelection();
    if (!selection) {
        throw new Error("No selection available");
    }
    const range = document.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    selection.removeAllRanges();
    selection.addRange(range);
};
