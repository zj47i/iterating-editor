import { Synchronizer } from "../../syncronizer/syncronizer";
import { DomNode } from "../../dom/dom-node";
import { CommandBase } from "../command.base";

export class BackspaceTextNode extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(selection: Selection, textNode: Text, event: KeyboardEvent) {
        console.info("BackspaceTextNode");
        const span = DomNode.fromExistingElement(textNode.parentElement);
        const paragraph = span.getParent();
        const paragraphVDomNode = this.sync.findVDomNodeFrom(paragraph);

        const previousParagraphVDomNode =
            paragraphVDomNode.getPreviousSibling();
        if (!previousParagraphVDomNode) {
            event.preventDefault();
            return;
        }
        this.sync.merge(previousParagraphVDomNode, paragraphVDomNode);
        const range = document.createRange();
        range.setStart(textNode, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
