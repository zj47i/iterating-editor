import { Synchronizer } from "../../syncronizer/syncronizer";
import { DomNode } from "../../dom/dom-node";
import { CommandBase } from "../command.base";

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
