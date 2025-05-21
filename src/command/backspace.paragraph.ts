import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { DomNode } from "../dom/dom-node.ts";
import { CommandBase } from "./command.base.ts";

export class BackspaceParagraph extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(paragraph: DomNode, event: KeyboardEvent) {
        console.info("BackspaceParagraph$");
        const vParagraph = this.sync.findVDomNodeFrom(paragraph);

        const vPreviousParagraph =
            vParagraph.getPreviousSibling();
        if (vPreviousParagraph) {
            this.sync.remove(vParagraph);
            event.preventDefault();
        } else {
            event.preventDefault();
        }
    }
}
