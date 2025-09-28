import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { DomNode } from "../dom/dom-node.ts";
import { CommandBase } from "./command.base.ts";
import { position } from "./selection/position.ts";
import { SelectionStateMachine } from "../state-machine/selection.state-machine.ts";

export interface InputPayload {
    data: string;
}

export class InputHandler extends CommandBase {
    private constructor(sync: Synchronizer) {
        super(sync);
    }

    /**
     * 텍스트 노드 입력 처리 함수 (execute 내부 분리)
     */
    private handleTextNodeInput(textNode: Text, currentCursorPosition: number) {
        if (!textNode.parentElement) {
            throw new Error("textNode parentElement is null");
        }
        const parent = DomNode.fromExistingElement(textNode.parentElement);
        if (parent.getNodeName() === "P") {
            console.info("InputHandler$Paragraph");
            const newSpan = DomNode.createSpan(textNode);
            this.sync.appendNewDomNode(parent, newSpan);
            position(textNode, currentCursorPosition);
        } else if (parent.getNodeName() === "SPAN") {
            console.info("InputHandler$TextNode");
            if (textNode.textContent === null) {
                throw new Error("textNode.textContent is null");
            }
            const span = DomNode.fromExistingElement(
                textNode.parentElement as HTMLElement
            );
            this.sync.setTextFromDom(span, textNode.textContent);
            position(textNode, currentCursorPosition);
        } else {
            throw new Error(
                `InputHandler: Unsupported parent node: ${parent.getNodeName()}`
            );
        }
    }

    /**
     * 입력 이벤트를 selectionStateMachine과 event만 받아 처리하도록 리팩터링
     */
    public execute(
        selectionStateMachine: SelectionStateMachine,
        payload: InputPayload
    ) {
        // Force update selection state to get real-time selection before processing input
        selectionStateMachine.forceUpdate();
        
        const currentSelectionState = selectionStateMachine.getState();
        if (!currentSelectionState.startContainer) {
            throw new Error("Selection startContainer is null");
        }
        const element = currentSelectionState.startContainer;
        if (element.nodeType === Node.TEXT_NODE) {
            if (!(element instanceof Text)) {
                throw new Error("textNode is not Text");
            }
            this.handleTextNodeInput(element, currentSelectionState.startOffset);
            return;
        }
        if (!(element instanceof HTMLElement)) {
            throw new Error("element is not HTMLElement");
        }
        if (
            element.nodeType === Node.ELEMENT_NODE &&
            element.nodeName === "P"
        ) {
            // Paragraph에 입력 시 새로운 span 생성 및 내용 삽입
            const paragraphNode = DomNode.fromExistingElement(element);
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            const data = payload.data;
            const newSpan = DomNode.createSpan(document.createTextNode(data));

            this.sync.appendNewDomNode(paragraphNode, newSpan);
            // 커서를 새 span의 끝으로 이동
            position(newSpan.getElement(), data.length);
            return;
        }
    }
}
