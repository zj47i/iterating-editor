import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { DomNode } from "../dom/dom-node.ts";
import { CommandBase } from "./command.base.ts";
import { position } from "./selection/position.ts";

export class InputParagraph extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(textNode: Text, paragraph: DomNode) {
        console.info("InputParagraph$");
        const newSpan = DomNode.createSpan(textNode);
        this.sync.appendNewDomNode(paragraph, newSpan);
        position(textNode, 1);
    }
}
