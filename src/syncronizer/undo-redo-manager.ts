export class UndoRedoManager<T> {
    private undoStack: T[] = [];
    private redoStack: T[] = [];

    push(state: T) {
        this.undoStack.push(state);
        this.redoStack = [];
    }

    undo(current: T): T | null {
        if (this.undoStack.length === 0) return null;
        this.redoStack.push(current);
        return this.undoStack.pop()!;
    }

    redo(current: T): T | null {
        if (this.redoStack.length === 0) return null;
        this.undoStack.push(current);
        return this.redoStack.pop()!;
    }

    clear() {
        this.undoStack = [];
        this.redoStack = [];
    }
}
