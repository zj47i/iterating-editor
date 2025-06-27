import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { DomNode } from "../dom/dom-node.ts";
import { CommandBase } from "./command.base.ts";
import { position } from "./selection/position.ts";
import { SelectionStateMachine } from "../state-machine/selection.state-machine.ts";

export class InputHandler extends CommandBase {
    private constructor(private sync: Synchronizer) {
        super(sync);
    }

    /**
     * 단락(P) 또는 SPAN에서 텍스트 입력을 처리합니다.
     * @param textNode 입력 대상 텍스트 노드
     * @param parent 입력 대상의 부모 DomNode (P 또는 SPAN)
     */
    public execute(
        textNode: Text,
        parent: DomNode,
        selectionStateMachine: SelectionStateMachine
    ) {
        if (parent.getNodeName() === "P") {
            console.info("InputHandler$Paragraph");
            const newSpan = DomNode.createSpan(textNode);
            this.sync.appendNewDomNode(parent, newSpan);
            position(textNode, textNode.length);
        } else if (parent.getNodeName() === "SPAN") {
            console.info("InputHandler$TextNode");
            if (textNode.parentElement === null) {
                throw new Error("textNode.parentElement is null");
            }
            if (textNode.textContent === null) {
                throw new Error("textNode.textContent is null");
            }
            const span = DomNode.fromExistingElement(textNode.parentElement);
            this.sync.setTextFromDom(span, textNode.textContent);
            position(textNode, selectionStateMachine.getState().startOffset);
        } else {
            throw new Error(
                `InputHandler: 지원하지 않는 부모 노드: ${parent.getNodeName()}`
            );
        }
    }
}
