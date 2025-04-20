enum EditorSelectionType {
    Range = "range",
    Cursor = "cursor",
}

export type EditorSelectionObject = Selection & {
    anchorNode: Node;
    anchorOffset: number;
    focusNode: Node;
    focusOffset: number;
};

export class EditorSelection {
    static isRangeSelection(
        selection: Selection
    ): selection is EditorSelectionObject {
        return (
            selection.anchorNode !== null &&
            selection.focusNode !== null &&
            (selection.anchorNode !== selection.focusNode ||
                selection.anchorOffset !== selection.focusOffset) &&
            typeof selection.anchorOffset === "number" &&
            typeof selection.focusOffset === "number"
        );
    }

    static isCursorSelection(
        selection: Selection
    ): selection is EditorSelectionObject {
        return (
            selection.anchorNode !== null &&
            typeof selection.anchorOffset === "number" &&
            selection.anchorNode === selection.focusNode &&
            selection.anchorOffset === selection.focusOffset
        );
    }

    static determinSelectionType(selection: Selection) {
        if (this.isRangeSelection(selection)) {
            return EditorSelectionType.Range;
        } else if (this.isCursorSelection(selection)) {
            return EditorSelectionType.Cursor;
        }
    }

    static getSelection(): EditorSelectionObject {
        const selection = document.getSelection();
        if (!selection) {
            throw new Error("selection is null");
        }
        if (
            this.isRangeSelection(selection) ||
            this.isCursorSelection(selection)
        ) {
            return selection;
        }
        throw new Error("selection is not range or cursor");
    }
}
