import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { DomNode } from "../dom/dom-node.ts";
import { CommandBase } from "./command.base.ts";
import { EditorSelectionObject } from "../editor.selection.ts";

export class BackspaceTextNode extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(
        selection: EditorSelectionObject,
        textNode: Text,
        event: KeyboardEvent
    ) {
        console.info("BackspaceTextNode$");
        if (textNode.parentElement === null) {
            throw new Error("textNode.parentElement is null");
        }
        const span = DomNode.fromExistingElement(textNode.parentElement);
        const paragraph = span.getParent();
        if (paragraph === null) {
            throw new Error("span.getParent() is null");
        }
        const paragraphVDomNode = this.sync.findVDomNodeFrom(paragraph);

        const previousParagraphVDomNode =
            paragraphVDomNode.getPreviousSibling();
        if (previousParagraphVDomNode) {
            this.sync.merge(previousParagraphVDomNode, paragraphVDomNode);
            const range = document.createRange();
            range.setStart(textNode, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        event.preventDefault();
        return;
    }
}
