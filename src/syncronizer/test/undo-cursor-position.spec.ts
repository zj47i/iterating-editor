import "@testing-library/jest-dom";
import { mockSyncronizer } from "./syncronizer.mock.spec";
import { Synchronizer } from "../syncronizer";
import { DomNode } from "../../dom/dom-node";
import { VDomNode } from "../../vdom/vdom-node";
import { SelectionStateMachine } from "../../state-machine/selection.state-machine";

describe("syncronizer undo cursor position", () => {
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

    test("undo restores text content", () => {
        // Initial text: "hello"
        expect(vSpan1.getText()).toBe("hello");
        
        // Change text to "hello world"
        sync.setText(vSpan1, "hello world");
        
        // Verify the text changed
        expect(vSpan1.getText()).toBe("hello world");
        
        // Perform undo
        sync.undo();
        
        // Find the current span node (might be different after undo due to DOM rebuild)
        const currentSpan = vDom.getChildren()[0]?.getChildren()[0];
        expect(currentSpan).toBeDefined();
        expect(currentSpan?.getText()).toBe("hello");
    });

    test("undo preserves cursor position", () => {
        // Initial text: "hello"
        expect(vSpan1.getText()).toBe("hello");
        
        // Simulate cursor position at offset 2 (after "he")
        const textNode = span1.getElement().firstChild as Text;
        expect(textNode).toBeDefined();
        expect(textNode.nodeType).toBe(Node.TEXT_NODE);
        
        // Set selection at position 2
        const selection = document.getSelection()!;
        const range = document.createRange();
        range.setStart(textNode, 2);
        range.setEnd(textNode, 2);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Force selection state machine to update
        selectionStateMachine.transition(new Event("selectionchange"));
        
        // Change text to "hello world" (simulating insertion at cursor position)
        sync.setText(vSpan1, "hello world");
        
        // Verify the text changed
        expect(vSpan1.getText()).toBe("hello world");
        
        // Perform undo
        sync.undo();
        
        // Find the current span node after undo
        const currentSpan = vDom.getChildren()[0]?.getChildren()[0];
        expect(currentSpan).toBeDefined();
        expect(currentSpan?.getText()).toBe("hello");
        
        // Verify cursor position is preserved (should be at offset 2)
        const currentSelection = document.getSelection()!;
        expect(currentSelection.rangeCount).toBe(1);
        const currentRange = currentSelection.getRangeAt(0);
        expect(currentRange.startOffset).toBe(2);
        expect(currentRange.endOffset).toBe(2);
    });

    test("undo with null cursor position doesn't crash", () => {
        // Don't set up selection state machine to simulate null cursor position
        const syncWithoutSelection = new Synchronizer(dom, vDom);
        
        // Change text
        syncWithoutSelection.setText(vSpan1, "hello world");
        
        // Perform undo - should not crash
        expect(() => {
            syncWithoutSelection.undo();
        }).not.toThrow();
    });
});