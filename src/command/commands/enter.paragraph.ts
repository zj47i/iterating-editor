import { VDomNode } from "../../vdom/vdom-node";
import { VDomNodeType } from "../../vdom/vdom-node.enum";
import { Synchronizer } from "../../syncronizer/syncronizer";
import { DomNode } from "../../dom/dom-node";
import { CommandBase } from "../command.base";

export class EnterParagraph extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(selection: Selection, paragraph: DomNode) {
        console.info("EnterParagraph$");
        const vParagraph = this.sync.findVDomNodeFrom(paragraph);
        const newVParagraph = new VDomNode(VDomNodeType.PARAGRAPH);
        this.sync.addNewNextSiblings(vParagraph, [newVParagraph]);
        const range = document.createRange();
        range.setStart(paragraph.getNextSibling().getElement(), 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
