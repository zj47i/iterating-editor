import { describe, test, expect, beforeEach } from "@jest/globals";
import { SelectionStateMachine } from "../state-machine/selection.state-machine";

describe("Selection Timing Issue", () => {
    let container: HTMLDivElement;
    let selectionStateMachine: SelectionStateMachine;
    
    beforeEach(() => {
        // Setup DOM environment
        document.body.innerHTML = '<div id="editor" contenteditable="true"><p></p></div>';
        container = document.getElementById("editor") as HTMLDivElement;
        
        selectionStateMachine = new SelectionStateMachine(container);
    });

    test("forceUpdate synchronizes selection state immediately", () => {
        // Setup: Create a text node and set cursor position
        const paragraph = container.querySelector("p") as HTMLParagraphElement;
        const textNode = document.createTextNode("Hello");
        paragraph.appendChild(textNode);
        
        // Set selection in the middle of the text
        const range = document.createRange();
        range.setStart(textNode, 2); // Position after "He"
        range.setEnd(textNode, 2);
        
        const selection = document.getSelection()!;
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Before forceUpdate, the state machine might have stale data
        // After forceUpdate, it should have current selection
        selectionStateMachine.forceUpdate();
        
        const state = selectionStateMachine.getState();
        expect(state.startContainer).toBe(textNode);
        expect(state.startOffset).toBe(2);
        expect(state.endContainer).toBe(textNode);
        expect(state.endOffset).toBe(2);
    });

    test("forceUpdate handles invalid selection gracefully", () => {
        // Clear all selections
        const selection = document.getSelection()!;
        selection.removeAllRanges();
        
        // forceUpdate should not throw even with no selection
        expect(() => {
            selectionStateMachine.forceUpdate();
        }).not.toThrow();
    });

    test("forceUpdate only updates when selection is within target element", () => {
        // First, set up a valid selection within the editor
        const paragraph = container.querySelector("p") as HTMLParagraphElement;
        const textNode = document.createTextNode("Hello");
        paragraph.appendChild(textNode);
        
        const range = document.createRange();
        range.setStart(textNode, 1);
        range.setEnd(textNode, 1);
        
        const selection = document.getSelection()!;
        selection.removeAllRanges();
        selection.addRange(range);
        
        selectionStateMachine.forceUpdate();
        const initialState = selectionStateMachine.getState();
        
        // Create another element outside the editor
        const outsideElement = document.createElement("div");
        outsideElement.textContent = "outside";
        document.body.appendChild(outsideElement);
        
        // Set selection in the outside element
        const outsideRange = document.createRange();
        outsideRange.selectNodeContents(outsideElement);
        
        selection.removeAllRanges();
        selection.addRange(outsideRange);
        
        // forceUpdate should not change state for outside selections
        selectionStateMachine.forceUpdate();
        
        const finalState = selectionStateMachine.getState();
        expect(finalState.startContainer).toBe(initialState.startContainer);
        expect(finalState.startOffset).toBe(initialState.startOffset);
        
        // Cleanup
        document.body.removeChild(outsideElement);
    });

    test("forceUpdate detects range selection correctly", () => {
        // Setup: Create a text node and set range selection
        const paragraph = container.querySelector("p") as HTMLParagraphElement;
        const textNode = document.createTextNode("Hello World");
        paragraph.appendChild(textNode);
        
        // Set selection from position 2 to 7 ("llo W")
        const range = document.createRange();
        range.setStart(textNode, 2);
        range.setEnd(textNode, 7);
        
        const selection = document.getSelection()!;
        selection.removeAllRanges();
        selection.addRange(range);
        
        selectionStateMachine.forceUpdate();
        
        const state = selectionStateMachine.getState();
        expect(state.startContainer).toBe(textNode);
        expect(state.startOffset).toBe(2);
        expect(state.endContainer).toBe(textNode);
        expect(state.endOffset).toBe(7);
        expect(selectionStateMachine.isRange()).toBe(true);
        expect(selectionStateMachine.isCursor()).toBe(false);
    });
});