export const range = (element: HTMLElement) => {
    const selection = window.getSelection();
    if (!selection) {
        throw new Error("No selection available");
    }
    const range = document.createRange();
    range.selectNode(element);
    selection.removeAllRanges();
    selection.addRange(range);
};

export const rangeText = (
    startNode: Text,
    startOffset: number,
    endNode: Text,
    endOffset: number
) => {
    const selection = window.getSelection();
    if (!selection) {
        throw new Error("No selection available");
    }
    const range = document.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    selection.removeAllRanges();
    selection.addRange(range);
};
