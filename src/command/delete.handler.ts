import { VDomNode } from "../vdom/vdom-node.ts";
import { VDomNodeType } from "../vdom/vdom-node.enum.ts";
import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { DomNode } from "../dom/dom-node.ts";
import { CommandBase } from "./command.base.ts";
import { position } from "./selection/position.ts";
import { SelectionStateMachine } from "../state-machine/selection.state-machine.ts";

export class DeleteHandler extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    // 텍스트노드가 기준일때만 동작하는듯 한데, 다시한번 쭉 살펴보기

    public static exec(
        sync: Synchronizer,
        selectionStateMachine: SelectionStateMachine
    ) {
        const handler = new DeleteHandler(sync);
        handler.deleteRange(selectionStateMachine);
    }

    private deleteRange(selectionStateMachine: SelectionStateMachine) {
        console.info("DeleteRange$");
        const endNode = selectionStateMachine.getState().endContainer;
        const endNodeOffset = selectionStateMachine.getState().endOffset;
        const startNode = selectionStateMachine.getState().startContainer;
        const startNodeOffset = selectionStateMachine.getState().startOffset;

        if (startNode.parentElement === null) {
            throw new Error("startNode.parentElement is null");
        }
        if (endNode.parentElement === null) {
            throw new Error("endNode.parentElement is null");
        }
        const startVNode = this.sync.findVDomNodeFrom(
            DomNode.fromExistingElement(startNode.parentElement)
        );
        const endVNode = this.sync.findVDomNodeFrom(
            DomNode.fromExistingElement(endNode.parentElement)
        );

        if (startNode.textContent === null) {
            throw new Error("startNode.textContent is null");
        }
        if (endNode.textContent === null) {
            throw new Error("endNode.textContent is null");
        }
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
        position(firstChild, startNodeOffset);
    }
}
