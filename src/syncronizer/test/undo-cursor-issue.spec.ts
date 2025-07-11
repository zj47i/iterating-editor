import "@testing-library/jest-dom";
import { mockSyncronizer } from "./syncronizer.mock.spec";
import { Synchronizer } from "../syncronizer";
import { DomNode } from "../../dom/dom-node";
import { VDomNode } from "../../vdom/vdom-node";
import { SelectionStateMachine } from "../../state-machine/selection.state-machine";

// 이 테스트는 undo 시 커서가 논리적으로 올바른 위치(입력 전 위치)로 복원되는지 검증합니다.
describe("undo logical cursor restoration", () => {
    let sync: Synchronizer,
        dom: DomNode,
        vDom: VDomNode,
        vP1: VDomNode,
        p1: DomNode,
        vSpan1: VDomNode,
        span1: DomNode,
        selectionStateMachine: SelectionStateMachine;

    beforeEach(() => {
        // mockSyncronizer가 selectionStateMachine도 반환하도록 구현되어야 함
        ({ sync, dom, vDom, vP1, p1, vSpan1, span1, selectionStateMachine } =
            mockSyncronizer());
    });

    afterEach(() => {
        document.body.innerHTML = "";
        sync.checkSync();
    });

    it("undo restores cursor to logical position before last input", () => {
        // 1. 초기 텍스트 "abcde"
        sync.setText(vSpan1, "abcde");
        const textNode = span1.getElement().firstChild as Text;
        expect(textNode).toBeDefined();
        expect(textNode.nodeType).toBe(Node.TEXT_NODE);

        // 2. 커서를 'c'와 'd' 사이(3)로 이동
        const selection = document.getSelection()!;
        const range = document.createRange();
        range.setStart(textNode, 3);
        range.setEnd(textNode, 3);
        selection.removeAllRanges();
        selection.addRange(range);
        selectionStateMachine.transition(new Event("selectionchange"));

        // 3. 'X' 입력 ("abcXde")
        sync.setText(vSpan1, "abcXde");
        // 커서를 'X' 뒤(4)로 이동
        const textNode2 = span1.getElement().firstChild as Text;
        const range2 = document.createRange();
        range2.setStart(textNode2, 4);
        range2.setEnd(textNode2, 4);
        selection.removeAllRanges();
        selection.addRange(range2);
        selectionStateMachine.transition(new Event("selectionchange"));

        // 4. undo 실행
        sync.undo();

        // 5. 텍스트는 "abcde"로, 커서는 'c'와 'd' 사이(3)로 복원되어야 함
        const currentSpan = vDom.getChildren()[0]?.getChildren()[0];
        expect(currentSpan).toBeDefined();
        expect(currentSpan?.getText()).toBe("abcde");
        const currentSelection = document.getSelection()!;
        expect(currentSelection.rangeCount).toBe(1);
        const currentRange = currentSelection.getRangeAt(0);
        expect(currentRange.startOffset).toBe(3);
        expect(currentRange.endOffset).toBe(3);
    });
});
