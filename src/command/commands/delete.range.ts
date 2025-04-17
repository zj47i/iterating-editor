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
        const { endNode, endNodeOffset, startNode, startNodeOffset } =
            startEndTextNodes(selection);
        const startVNode = this.sync.findVDomNodeFrom(
            DomNode.fromExistingElement(startNode.parentElement)
        );
        const endVNode = this.sync.findVDomNodeFrom(
            DomNode.fromExistingElement(endNode.parentElement)
        );

        const leftText =
            startNode.textContent.slice(0, startNodeOffset) +
            endNode.textContent.slice(endNodeOffset);

        if (startVNode === endVNode) {
            this.sync.setText(startVNode, leftText);
        } else {
            this.sync.setText(
                startVNode,
                startNode.textContent.slice(0, startNodeOffset)
            );
            this.sync.setText(
                endVNode,
                endNode.textContent.slice(endNodeOffset)
            );

            const all = VDomNode.findVDomNodesBetween(
                startVNode,
                endVNode
            ).filter((v) => v.type === VDomNodeType.SPAN);

            const middleNodes = all.filter(
                (v) => v !== startVNode && v !== endVNode
            );
            for (const node of middleNodes) {
                this.sync.remove(node);
            }
        }
        const startSpan = this.sync.findDomNodeFrom(startVNode);
        const firstChild = startSpan.getElement().firstChild;
        if (!firstChild) {
            throw new Error("firstChild is null");
        }
        position(selection, firstChild, startNodeOffset);
    }
}
