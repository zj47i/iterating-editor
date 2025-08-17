import "@testing-library/jest-dom";
import { mockSyncronizer } from "../syncronizer/test/syncronizer.mock.spec";
import { Synchronizer } from "../syncronizer/syncronizer";
import { DomNode } from "../dom/dom-node";
import { VDomNode } from "../vdom/vdom-node";
import { SelectionStateMachine } from "../state-machine/selection.state-machine";

describe("backspace cursor positioning issue", () => {
    let sync: Synchronizer,
        dom: DomNode,
        vDom: VDomNode,
        vP1: VDomNode,
        p1: DomNode,
        vSpan1: VDomNode,
        span1: DomNode,
        selectionStateMachine: SelectionStateMachine;

    beforeEach(() => {
        ({ sync, dom, vDom, vP1, p1, vSpan1, span1, selectionStateMachine } =
            mockSyncronizer());
    });

    afterEach(() => {
        document.body.innerHTML = "";
        sync.checkSync();
    });

    test("reproduce original issue: cursor after backspace from aaabccc", () => {
        // Setup the exact scenario from the issue description:
        // "문자열 aaabccc가 있고 커서를 b다음에 놓은 다음에 백스페이스를 누르면"
        sync.setText(vSpan1, "aaabccc");
        expect(vSpan1.getText()).toBe("aaabccc");
        
        // Position cursor after "b" (offset 4: a-a-a-b|c-c-c)
        const textNode = span1.getElement().firstChild as Text;
        const selection = document.getSelection()!;
        const range = document.createRange();
        range.setStart(textNode, 4);
        range.setEnd(textNode, 4);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Force selection state machine to update
        selectionStateMachine.forceUpdate();
        
        // Verify initial cursor position (after "b")
        let currentState = selectionStateMachine.getState();
        expect(currentState.startContainer).toBe(textNode);
        expect(currentState.startOffset).toBe(4);
        
        // Simulate the result of backspace: 
        // "문자열은 aaaccc가 되고 커서의 위치는 마지막 a다음이 되어야 하는데"
        
        // Position cursor where it should be after backspace (after last "a", position 3)
        const newRange = document.createRange();
        newRange.setStart(textNode, 3);  // Position after last 'a'
        newRange.setEnd(textNode, 3);
        selection.removeAllRanges();
        selection.addRange(newRange);
        selectionStateMachine.forceUpdate();
        
        // Update text to "aaaccc" (simulate the backspace removing "b")
        sync.setText(vSpan1, "aaaccc");
        
        // Verify the fix: text should be "aaaccc" and cursor should be at position 3
        expect(vSpan1.getText()).toBe("aaaccc");
        
        const currentSelection = document.getSelection()!;
        expect(currentSelection.rangeCount).toBe(1);
        
        const currentRange = currentSelection.getRangeAt(0);
        
        // The issue was: "커서는 항상 문자열 맨 마지막으로 이동하네"
        // With the fix, cursor should stay at position 3 (after last "a")
        expect(currentRange.startOffset).toBe(3);
        expect(currentRange.endOffset).toBe(3);
        
        // Verify cursor is NOT at the end of string (position 6 would be end of "aaaccc")
        expect(currentRange.startOffset).not.toBe(6);
    });

    test("setText preserves cursor position during text updates", () => {
        // Setup: Create text "hello" in span
        sync.setText(vSpan1, "hello");
        expect(vSpan1.getText()).toBe("hello");
        
        // Position cursor in the middle (offset 2: he|llo)
        const textNode = span1.getElement().firstChild as Text;
        const selection = document.getSelection()!;
        const range = document.createRange();
        range.setStart(textNode, 2);
        range.setEnd(textNode, 2);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Force selection state machine to update to capture current position
        selectionStateMachine.forceUpdate();
        
        // Update text while cursor is positioned - this simulates what happens during editing
        sync.setText(vSpan1, "world");
        
        // Check that text was updated correctly
        expect(vSpan1.getText()).toBe("world");
        
        // Cursor should still be at position 2 (wo|rld) - this is the key fix
        const currentSelection = document.getSelection()!;
        expect(currentSelection.rangeCount).toBe(1);
        
        const currentRange = currentSelection.getRangeAt(0);
        expect(currentRange.startOffset).toBe(2);
        expect(currentRange.endOffset).toBe(2);
    });
    
    test("setText adjusts cursor position when new text is shorter", () => {
        // Setup: Create longer text
        sync.setText(vSpan1, "hello world");
        expect(vSpan1.getText()).toBe("hello world");
        
        // Position cursor near the end (offset 9: hello wor|ld)
        const textNode = span1.getElement().firstChild as Text;
        const selection = document.getSelection()!;
        const range = document.createRange();
        range.setStart(textNode, 9);
        range.setEnd(textNode, 9);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Force selection state machine to update
        selectionStateMachine.forceUpdate();
        
        // Update to shorter text
        sync.setText(vSpan1, "hi");
        
        // Check that text was updated correctly
        expect(vSpan1.getText()).toBe("hi");
        
        // Cursor should be adjusted to end of new text (position 2: hi|)
        const currentSelection = document.getSelection()!;
        expect(currentSelection.rangeCount).toBe(1);
        
        const currentRange = currentSelection.getRangeAt(0);
        expect(currentRange.startOffset).toBe(2); // End of "hi"
        expect(currentRange.endOffset).toBe(2);
    });
});