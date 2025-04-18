import { Synchronizer } from "../../syncronizer/syncronizer";
import { DomNode } from "../../dom/dom-node";
import { CommandBase } from "../command.base";
import { EditorSelectionObject } from "../../editor/editor.selection";

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
