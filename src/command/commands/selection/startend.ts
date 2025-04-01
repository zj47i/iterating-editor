import { DomNode } from "../../../dom/dom-node";

export const startEndTextNodes = (selection: Selection) => {
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
    }
    else if (
        anchorNode.compareDocumentPosition(focusNode) ===
        Node.DOCUMENT_POSITION_FOLLOWING
    ) {
        [startNode, endNode, startNodeOffset, endNodeOffset] = [
            anchorNode,
            focusNode,
            anchorOffset,
            focusOffset,
        ];
    }
    else if (
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
    if (!(startNode instanceof Text)) {
        console.error("startNode is not Text");
        return;
    }
    if (!(endNode instanceof Text)) {
        console.error("endNode is not Text");
        return;
    }
    return {
        startNode,
        endNode,
        startNodeOffset,
        endNodeOffset,
    }
}