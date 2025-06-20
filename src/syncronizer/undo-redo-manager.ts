import { EditorState } from "./editor-state";

export class UndoRedoManager {
    private undoStack: EditorState[] = [];
    private redoStack: EditorState[] = [];

    push(state: EditorState) {
        this.undoStack.push(state);
        this.redoStack = [];
    }

    undo(current: EditorState): EditorState | null {
        if (this.undoStack.length === 0) return null;
        this.redoStack.push(current);
        return this.undoStack.pop()!;
    }

    redo(current: EditorState): EditorState | null {
        if (this.redoStack.length === 0) return null;
        this.undoStack.push(current);
        return this.redoStack.pop()!;
    }

    clear() {
        this.undoStack = [];
        this.redoStack = [];
    }
}
