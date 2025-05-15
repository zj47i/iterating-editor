import { Synchronizer } from "../../syncronizer/syncronizer";
import { DomNode } from "../../dom/dom-node";
import { CommandBase } from "../command.base";

export class InputTextNode extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(textNode: Text) {
        console.info("InputTextNode$");
        if (textNode.parentElement === null) {
            throw new Error("textNode.parentElement is null");
        }
        if (textNode.textContent === null) {
            throw new Error("textNode.textContent is null");
        }
        const span = DomNode.fromExistingElement(textNode.parentElement);
        this.sync.setTextFromDom(span, textNode.textContent);
    }
}
