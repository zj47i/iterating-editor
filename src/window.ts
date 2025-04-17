type RangeSelection = Selection & {
    anchorNode: Node;
    anchorOffset: number;
    focusNode: Node;
    focusOffset: number;
};

type CursorSelection = Selection & {
    anchorNode: Node;
    anchorOffset: number;
    focusNode: Node;
    focusOffset: number;
};

export class Window {
    public static isRangeSelection(
        selection: Selection
    ): selection is RangeSelection {
        return (
            selection.anchorNode !== null &&
            selection.focusNode !== null &&
            (selection.anchorNode !== selection.focusNode ||
                selection.anchorOffset !== selection.focusOffset) &&
            typeof selection.anchorOffset === "number" &&
            typeof selection.focusOffset === "number"
        );
    }

    static getRangeSelection(): Selection & {
        anchorNode: Node;
        anchorOffset: number;
        focusNode: Node;
        focusOffset: number;
    } {
        const selection = getSelection();
        if (!selection) {
            throw new Error("No selection");
        }
        if (this.isRangeSelection(selection)) {
            return selection;
        }
        throw new Error("No Range selection");
    }

    public static isCursorSelection(
        selection: Selection
    ): selection is CursorSelection {
        return (
            selection.anchorNode !== null &&
            typeof selection.anchorOffset === "number" &&
            selection.anchorNode === selection.focusNode &&
            selection.anchorOffset === selection.focusOffset
        );
    }

    static getCursorSelection(): Selection & {
        anchorNode: Node;
        anchorOffset: number;
        focusNode: Node;
        focusOffset: number;
    } {
        const selection = getSelection();
        if (!selection) {
            throw new Error("No selection");
        }
        if (this.isCursorSelection(selection)) {
            return selection;
        }
        throw new Error("No Cursor selection");
    }
}
