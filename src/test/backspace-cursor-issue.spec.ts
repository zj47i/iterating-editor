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

    test("simulate backspace in middle of text and check cursor position behavior", () => {
        // Setup: Create text "aaabccc" in span
        sync.setText(vSpan1, "aaabccc");
        expect(vSpan1.getText()).toBe("aaabccc");
        
        // Position cursor after "b" (offset 4: a-a-a-b|c-c-c)
        const textNode = span1.getElement().firstChild as Text;
        expect(textNode).toBeDefined();
        expect(textNode.nodeType).toBe(Node.TEXT_NODE);
        expect(textNode.textContent).toBe("aaabccc");
        
        // Set cursor position after "b" (offset 4)
        const selection = document.getSelection()!;
        const range = document.createRange();
        range.setStart(textNode, 4);
        range.setEnd(textNode, 4);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Force selection state machine to update
        selectionStateMachine.forceUpdate();
        
        // Verify initial cursor position
        let currentState = selectionStateMachine.getState();
        expect(currentState.startContainer).toBe(textNode);
        expect(currentState.startOffset).toBe(4);
        
        // Simulate what happens with a regular backspace - delete character at cursor-1 and move cursor back
        // Manually simulate the text change that would happen with backspace
        const newText = "aaaccc"; // Remove the "b"
        sync.setText(vSpan1, newText);
        
        // Check that text was updated correctly
        expect(vSpan1.getText()).toBe("aaaccc");
        
        // The issue: cursor position should be at 3 after backspace, but let's see what happens
        // when we don't explicitly set cursor position
        const updatedSpan = vDom.getChildren()[0]?.getChildren()[0];
        expect(updatedSpan?.getText()).toBe("aaaccc");
        
        // Check current cursor position after the text change
        const currentSelection = document.getSelection()!;
        console.log("Current selection ranges:", currentSelection.rangeCount);
        if (currentSelection.rangeCount > 0) {
            const currentRange = currentSelection.getRangeAt(0);
            console.log("Cursor position:", currentRange.startOffset, "in", currentRange.startContainer);
            console.log("Expected position: 3, Actual position:", currentRange.startOffset);
        }
        
        // This test documents the current behavior - we'll see what actually happens
        // The real fix will need to happen in the synchronizer or backspace handler
    });
});