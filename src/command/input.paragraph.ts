import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { DomNode } from "../dom/dom-node.ts";
import { CommandBase } from "./command.base.ts";
import { EditorSelectionObject } from "../editor.selection.ts";

export class InputParagraph extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(
        textNode: Text,
        paragraph: DomNode,
        selection: EditorSelectionObject
    ) {
        console.info("InputParagraph$");
        const newSpan = DomNode.createSpan(textNode);
        this.sync.appendNewDomNode(paragraph, newSpan);
        const range = document.createRange();
        range.setStart(textNode, 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
