import "@testing-library/jest-dom";
import { mockSyncronizer } from "./syncronizer.mock.spec";
import { Synchronizer } from "../syncronizer";
import { DomNode } from "../../dom/dom-node";
import { VDomNode } from "../../vdom/vdom-node";
import { SelectionStateMachine } from "../../state-machine/selection.state-machine";

describe("undo cursor position issue reproduction", () => {
    let sync: Synchronizer,
        dom: DomNode,
        vDom: VDomNode,
        vP1: VDomNode,
        p1: DomNode,
        vSpan1: VDomNode,
        span1: DomNode,
        selectionStateMachine: SelectionStateMachine;

    beforeEach(() => {
        ({ sync, dom, vDom, vP1, p1, vSpan1, span1 } = mockSyncronizer());
        selectionStateMachine = new SelectionStateMachine();
        sync.setSelectionStateMachine(selectionStateMachine);
    });

    afterEach(() => {
        document.body.innerHTML = "";
        sync.checkSync();
    });

    test("undo should position cursor before last input, not after (regression test)", () => {
        // Setup: Start with "1234567" text
        sync.setText(vSpan1, "1234567");
        
        // Position cursor between "4" and "5" (offset 4)
        let textNode = span1.getElement().firstChild as Text;
        expect(textNode).toBeDefined();
        expect(textNode.nodeType).toBe(Node.TEXT_NODE);
        
        const selection = document.getSelection()!;
        let range = document.createRange();
        range.setStart(textNode, 4); // Between "4" and "5"
        range.setEnd(textNode, 4);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Force selection state machine to update
        selectionStateMachine.transition(new Event("selectionchange"));
        
        // Step 1: Type "a" -> "1234a567"
        sync.setText(vSpan1, "1234a567");
        
        // Move cursor to position 5 (after "a")
        textNode = span1.getElement().firstChild as Text;
        range = document.createRange();
        range.setStart(textNode, 5);
        range.setEnd(textNode, 5);
        selection.removeAllRanges();
        selection.addRange(range);
        selectionStateMachine.transition(new Event("selectionchange"));
        
        // Step 2: Type "s" -> "1234as567" 
        sync.setText(vSpan1, "1234as567");
        
        // Move cursor to position 6 (after "s")
        textNode = span1.getElement().firstChild as Text;
        range = document.createRange();
        range.setStart(textNode, 6);
        range.setEnd(textNode, 6);
        selection.removeAllRanges();
        selection.addRange(range);
        selectionStateMachine.transition(new Event("selectionchange"));
        
        // Step 3: Type "d" -> "1234asd567"
        sync.setText(vSpan1, "1234asd567");
        
        // Move cursor to position 7 (after "d")
        textNode = span1.getElement().firstChild as Text;
        range = document.createRange();
        range.setStart(textNode, 7);
        range.setEnd(textNode, 7);
        selection.removeAllRanges();
        selection.addRange(range);
        selectionStateMachine.transition(new Event("selectionchange"));
        
        // Step 4: Type "f" -> "1234asdf567"
        // The saveCurrentVdom should capture cursor position 7 (before "f" is processed)
        sync.setText(vSpan1, "1234asdf567");
        
        // Move cursor to position 8 (after "f" - simulating natural typing)
        textNode = span1.getElement().firstChild as Text;
        range = document.createRange();
        range.setStart(textNode, 8);
        range.setEnd(textNode, 8);
        selection.removeAllRanges();
        selection.addRange(range);
        selectionStateMachine.transition(new Event("selectionchange"));
        
        // Verify current state
        expect(vSpan1.getText()).toBe("1234asdf567");
        expect(selection.getRangeAt(0).startOffset).toBe(8);
        
        // Now undo - this should undo the "f" insertion and restore cursor to position 7
        sync.undo();
        
        // After undo, text should be "1234asd567"
        const currentSpan = vDom.getChildren()[0]?.getChildren()[0];
        expect(currentSpan).toBeDefined();
        expect(currentSpan?.getText()).toBe("1234asd567");
        
        // Verify cursor position is restored to where it was BEFORE "f" was typed (position 7)
        const currentSelection = document.getSelection()!;
        expect(currentSelection.rangeCount).toBe(1);
        const currentRange = currentSelection.getRangeAt(0);
        
        // This is the fix: cursor should be at position 7 (between "d" and "5")
        // Before the fix, it would incorrectly be at position 8 (between "5" and "6")
        expect(currentRange.startOffset).toBe(7);
        expect(currentRange.endOffset).toBe(7);
    });
});