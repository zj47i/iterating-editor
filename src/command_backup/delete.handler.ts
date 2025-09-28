import { VDomNode } from "../vdom/vdom-node.ts";
import { VDomNodeType } from "../vdom/vdom-node.enum.ts";
import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { DomNode } from "../dom/dom-node.ts";
import { CommandBase } from "./command.base.ts";
import { position } from "./selection/position.ts";
import { SelectionStateMachine } from "../state-machine/selection.state-machine.ts";

export class DeleteHandler extends CommandBase {
    private constructor(sync: Synchronizer) {
        super(sync);
    }

    // exec를 execute로 변경하고, selectionStateMachine의 상태에 따라 분기
    public execute(selectionStateMachine: SelectionStateMachine) {
        if (selectionStateMachine.isRange()) {
            this.deleteRange(selectionStateMachine);
        } else if (selectionStateMachine.isCursor()) {
            this.deleteCursor(selectionStateMachine);
        } else {
            throw new Error("DeleteHandler: 알 수 없는 selection 상태");
        }
    }

    private deleteRange(selectionStateMachine: SelectionStateMachine) {
        console.info("DeleteRange$");
        const { endContainer, endOffset, startContainer, startOffset } =
            selectionStateMachine.getState();

        if (startContainer.parentElement === null) {
            throw new Error("startContainer.parentElement is null");
        }
        if (endContainer.parentElement === null) {
            throw new Error("endContainer.parentElement is null");
        }
        const startVNode = this.sync.findVDomNodeFrom(
            DomNode.fromExistingElement(startContainer.parentElement)
        );
        const endVNode = this.sync.findVDomNodeFrom(
            DomNode.fromExistingElement(endContainer.parentElement)
        );

        if (startContainer.textContent === null) {
            throw new Error("startContainer.textContent is null");
        }
        if (endContainer.textContent === null) {
            throw new Error("endContainer.textContent is null");
        }
        const leftText =
            startContainer.textContent.slice(0, startOffset) +
            endContainer.textContent.slice(endOffset);

        if (startVNode === endVNode) {
            this.sync.setText(startVNode, leftText);
        } else {
            this.sync.setText(
                startVNode,
                startContainer.textContent.slice(0, startOffset)
            );
            this.sync.setText(
                endVNode,
                endContainer.textContent.slice(endOffset)
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
        position(firstChild, startOffset);
    }

    // 커서 위치에서 다음 문자를 삭제하거나, 다음 줄을 병합하는 deleteCursor 메서드
    private deleteCursor(selectionStateMachine: SelectionStateMachine) {
        const state = selectionStateMachine.getState();
        const node = state.startContainer;
        const offset = state.startOffset;

        // 텍스트노드에서 다음 문자 삭제
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent === null) {
                throw new Error("node.textContent is null");
            }
            if (offset < node.textContent.length) {
                // 문자열 사이에서 다음 문자 삭제
                const newText =
                    node.textContent.slice(0, offset) +
                    node.textContent.slice(offset + 1);
                if (!(node.parentElement instanceof HTMLElement)) {
                    throw new Error("parentElement is not HTMLElement");
                }
                const vSpanNode = this.sync.findVDomNodeFrom(
                    DomNode.fromExistingElement(node.parentElement)
                );
                this.sync.setText(vSpanNode, newText);
                // setText 후 새로운 텍스트 노드를 찾아서 커서 위치 설정
                const vUpdatedSpanNode = this.sync.findDomNodeFrom(vSpanNode);
                const vNewTextNode = vUpdatedSpanNode.getElement().firstChild;
                if (vNewTextNode && vNewTextNode.nodeType === Node.TEXT_NODE) {
                    position(vNewTextNode, offset);
                } else {
                    position(node, offset); // fallback
                }
                return;
            }
        }
        // 문자열 맨 뒤 또는 빈 줄에서 다음 줄 병합
        // 다음 형제 노드가 있는지 확인
        let currentDomNode: DomNode;
        if (node.nodeType === Node.TEXT_NODE) {
            if (!(node.parentElement instanceof HTMLElement)) {
                throw new Error("parentElement is not HTMLElement");
            }
            currentDomNode = DomNode.fromExistingElement(node.parentElement);
        } else if (node instanceof HTMLElement) {
            currentDomNode = DomNode.fromExistingElement(node);
        } else {
            throw new Error("deleteCursor: 지원하지 않는 노드 타입");
        }
        const nextDomNode = currentDomNode.getNextSibling();
        if (nextDomNode) {
            const currentVNode = this.sync.findVDomNodeFrom(currentDomNode);
            const nextVNode = this.sync.findVDomNodeFrom(nextDomNode);
            // 현재 줄이 비어있거나, 텍스트노드의 끝에 커서가 있을 때 다음 줄 병합
            const currentText =
                node.nodeType === Node.TEXT_NODE ? node.textContent ?? "" : "";
            if (offset === currentText.length) {
                // 다음 줄의 모든 자식 노드를 현재 줄의 마지막에 append
                const currentElem = currentDomNode.getElement();
                const nextElem = nextDomNode.getElement();
                while (nextElem.firstChild) {
                    currentElem.appendChild(nextElem.firstChild);
                }
                this.sync.remove(nextVNode);
                // 커서를 병합된 첫 번째 노드(원래 커서 위치의 다음 노드)로 이동
                let newCursorNode =
                    currentElem.childNodes[offset] || currentElem.lastChild;
                let newOffset = 0;
                if (
                    newCursorNode &&
                    newCursorNode.nodeType === Node.TEXT_NODE
                ) {
                    newOffset = 0;
                } else if (
                    newCursorNode &&
                    newCursorNode.firstChild &&
                    newCursorNode.firstChild.nodeType === Node.TEXT_NODE
                ) {
                    newCursorNode = newCursorNode.firstChild;
                    newOffset = 0;
                } else {
                    // fallback: 마지막 텍스트노드의 끝
                    for (
                        let i = currentElem.childNodes.length - 1;
                        i >= 0;
                        i--
                    ) {
                        const child = currentElem.childNodes[i];
                        if (child.nodeType === Node.TEXT_NODE) {
                            newCursorNode = child;
                            newOffset = child.textContent?.length ?? 0;
                            break;
                        }
                    }
                }
                if (newCursorNode) {
                    position(newCursorNode, newOffset);
                }
                return;
            }
        }
        // 마지막 줄이거나, 더 이상 삭제할 것이 없으면 아무 동작 없음
    }
}
