import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { DomNode } from "../dom/dom-node.ts";
import { CommandBase } from "./command.base.ts";
import { position } from "./selection/position.ts";
import { EditorSelectionObject } from "../editor.selection.ts";

export class BackspaceTextNodeEmpty extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(
        selection: EditorSelectionObject,
        textNode: Text,
        event: KeyboardEvent
    ) {
        console.info("BackspaceTextNodeEmpty$");
        if (textNode.parentElement === null) {
            throw new Error("textNode.parentElement is null");
        }
        const span = DomNode.fromExistingElement(textNode.parentElement);
        const vSpan = this.sync.findVDomNodeFrom(span);
        const previousVSpan = vSpan.getPreviousSibling();
        if (previousVSpan) {
            this.sync.merge(previousVSpan, vSpan);
            position(
                selection,
                DomNode.fromVdom(previousVSpan).getElement(),
                previousVSpan.getText().length
            );
        } else {
            const parent = span.getParent();
            if (parent === null) {
                throw new Error("span.getParent() is null");
            }
            const nextVSpan = vSpan.getNextSibling();
            this.sync.remove(vSpan);
            if (nextVSpan) {
                position(
                    selection,
                    DomNode.fromVdom(nextVSpan).getElement(),
                    0
                );
            } else {
                position(selection, parent.getElement(), 0);
            }
        }
    }
}
