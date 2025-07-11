import { VDomNode } from "../vdom/vdom-node";

// VDOM 경로+offset 기반 커서 위치 타입
type LogicalCursor = { vdomPath: number[]; offset: number } | null;

export class UndoRedoManager {
    private undoStack: Array<{
        vdom: VDomNode;
        cursorPosition: LogicalCursor;
    }> = [];
    private redoStack: Array<{
        vdom: VDomNode;
        cursorPosition: LogicalCursor;
    }> = [];

    push(vdom: VDomNode, cursorPosition: LogicalCursor) {
        this.undoStack.push({ vdom, cursorPosition });
        this.redoStack = [];
    }

    undo(
        currentVdom: VDomNode,
        currentCursorPosition: LogicalCursor
    ): { vdom: VDomNode; cursorPosition: LogicalCursor } | null {
        if (this.undoStack.length === 0) return null;
        this.redoStack.push({
            vdom: currentVdom,
            cursorPosition: currentCursorPosition,
        });
        return this.undoStack.pop()!;
    }

    redo(
        currentVdom: VDomNode,
        currentCursorPosition: LogicalCursor
    ): { vdom: VDomNode; cursorPosition: LogicalCursor } | null {
        if (this.redoStack.length === 0) return null;
        this.undoStack.push({
            vdom: currentVdom,
            cursorPosition: currentCursorPosition,
        });
        return this.redoStack.pop()!;
    }

    clear() {
        this.undoStack = [];
        this.redoStack = [];
    }
}
