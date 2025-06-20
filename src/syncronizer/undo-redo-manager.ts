import { VDomNode } from "../vdom/vdom-node";
import { State } from "../state-machine/selection.state-machine";

export class UndoRedoManager {
    private undoStack: Array<{ vdom: VDomNode; cursorPosition: State | null }> = [];
    private redoStack: Array<{ vdom: VDomNode; cursorPosition: State | null }> = [];

    push(vdom: VDomNode, cursorPosition: State | null) {
        this.undoStack.push({ vdom, cursorPosition });
        this.redoStack = [];
    }

    undo(currentVdom: VDomNode, currentCursorPosition: State | null): { vdom: VDomNode; cursorPosition: State | null } | null {
        if (this.undoStack.length === 0) return null;
        this.redoStack.push({ vdom: currentVdom, cursorPosition: currentCursorPosition });
        return this.undoStack.pop()!;
    }

    redo(currentVdom: VDomNode, currentCursorPosition: State | null): { vdom: VDomNode; cursorPosition: State | null } | null {
        if (this.redoStack.length === 0) return null;
        this.undoStack.push({ vdom: currentVdom, cursorPosition: currentCursorPosition });
        return this.redoStack.pop()!;
    }

    clear() {
        this.undoStack = [];
        this.redoStack = [];
    }
}
