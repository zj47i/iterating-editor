import { EditorSelectionObject } from "../../../editor/editor.selection";

export const startEndTextNodes = (selection: EditorSelectionObject) => {
    let { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
    let startNode: Node,
        endNode: Node,
        startNodeOffset: number,
        endNodeOffset: number;
    if (anchorNode.compareDocumentPosition(focusNode) === 0) {
        if (anchorOffset === focusOffset) {
            [startNode, endNode, startNodeOffset, endNodeOffset] = [
                anchorNode,
                focusNode,
                anchorOffset,
                focusOffset,
            ];
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
    } else {
        throw new Error(
            "anchorNode and focusNode are not in the same document"
        );
    }
    if (!(startNode instanceof Text)) {
        throw new Error("startNode is not Text");
    }
    if (!(endNode instanceof Text)) {
        throw new Error("endNode is not Text");
    }
    return {
        startNode,
        endNode,
        startNodeOffset,
        endNodeOffset,
    };
};
