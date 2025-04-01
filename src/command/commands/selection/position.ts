import { DomNode } from "../../../dom/dom-node";

export const position = (selection: Selection, node: Node, offset: number) => {
    const range = document.createRange();
    range.setStart(node, offset);
    selection.removeAllRanges();
    selection.addRange(range);
}