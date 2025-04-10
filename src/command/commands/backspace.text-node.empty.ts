import { Synchronizer } from "../../syncronizer/syncronizer";
import { DomNode } from "../../dom/dom-node";
import { CommandBase } from "../command.base";
import { position } from "./selection/position";

export class BackspaceTextNodeEmpty extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(selection: Selection, textNode: Text, event: KeyboardEvent) {
        console.info("BackspaceTextNodeEmpty$");
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
