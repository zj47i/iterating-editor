import { VDomNode } from "../vdom/vdom-node";

export interface CursorPosition {
    startContainer: Node;
    startOffset: number;
    endContainer: Node;
    endOffset: number;
}

export interface EditorState {
    vdom: VDomNode;
    cursorPosition: CursorPosition | null;
}