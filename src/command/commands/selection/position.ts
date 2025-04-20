import { EditorSelectionObject } from "../../../editor.selection";

export const position = (
    selection: EditorSelectionObject,
    node: Node,
    offset: number
) => {
    const range = document.createRange();
    range.setStart(node, offset);
    selection.removeAllRanges();
    selection.addRange(range);
};
