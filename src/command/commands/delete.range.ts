import { VDomNode } from "../../vdom/vdom-node";
import { VDomNodeType } from "../../vdom/vdom-node.enum";
import { Synchronizer } from "../../syncronizer/syncronizer";
import { DomNode } from "../../dom/dom-node";
import { CommandBase } from "../command.base";
import { startEndTextNodes } from "./selection/startend";
import { position } from "./selection/position";

export class DeleteRange extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    public execute(selection: Selection) {
        console.info("DeleteRange$");
        const { endNode, endNodeOffset, startNode, startNodeOffset } = startEndTextNodes(selection);
        const startSpan = DomNode.fromExistingElement(startNode.parentElement);
        const endSpan = DomNode.fromExistingElement(endNode.parentElement);
        const startVSpan = this.sync.findVDomNodeFrom(startSpan);
        const endVSpan = this.sync.findVDomNodeFrom(endSpan);
        const vNodes = VDomNode.findVDomNodesBetween(startVSpan, endVSpan).filter(
            (vdomNode) => vdomNode.type === VDomNodeType.SPAN
        );
        const remainText = startNode.textContent.slice(0, startNodeOffset) + endNode.textContent.slice(endNodeOffset);
        if (startNodeOffset > 0 && startNodeOffset < startNode.textContent.length - 1) {
            const node = vNodes.shift();
            this.sync.setText(node, remainText);
        }
        while (vNodes.length > 0) {
            const vNode = vNodes.pop();
            this.sync.remove(vNode);
        }

        position(selection, startSpan.getElement().firstChild, startNodeOffset);
    }
}
