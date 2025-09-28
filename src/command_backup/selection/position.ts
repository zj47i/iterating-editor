export const position = (node: Node, offset: number) => {
    const selection = document.getSelection();
    if (!selection) {
        throw new Error("No selection available");
    }
    const range = document.createRange();
    range.setStart(node, offset);
    selection.removeAllRanges();
    selection.addRange(range);
};
