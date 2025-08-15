import { describe, test, expect, beforeEach } from "@jest/globals";
import { SelectionStateMachine } from "../state-machine/selection.state-machine";

describe("Selection State Machine Refactoring", () => {
    let container: HTMLDivElement;
    let selectionStateMachine: SelectionStateMachine;
    
    beforeEach(() => {
        // Setup DOM environment
        document.body.innerHTML = '<div id="editor" contenteditable="true"><p></p></div>';
        container = document.getElementById("editor") as HTMLDivElement;
        
        selectionStateMachine = new SelectionStateMachine(container);
    });

    test("StateFactory creates cursor state correctly", () => {
        // Setup: Create a text node and set cursor position
        const paragraph = container.querySelector("p") as HTMLParagraphElement;
        const textNode = document.createTextNode("Hello");
        paragraph.appendChild(textNode);
        
        // Set selection (cursor) in the middle of the text
        const range = document.createRange();
        range.setStart(textNode, 2);
        range.setEnd(textNode, 2);
        
        const selection = document.getSelection()!;
        selection.removeAllRanges();
        selection.addRange(range);
        
        selectionStateMachine.forceUpdate();
        
        const state = selectionStateMachine.getState();
        expect(state.startContainer).toBe(textNode);
        expect(state.startOffset).toBe(2);
        expect(state.endContainer).toBe(textNode);
        expect(state.endOffset).toBe(2);
        expect(selectionStateMachine.isCursor()).toBe(true);
        expect(selectionStateMachine.isRange()).toBe(false);
        expect(state.getName()).toBe("CursorState");
    });

    test("StateFactory creates range state correctly", () => {
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
        expect(state.getName()).toBe("RangeState");
    });

    test("State onEvent method returns new state or current state", () => {
        // Setup: Create a text node and set cursor position
        const paragraph = container.querySelector("p") as HTMLParagraphElement;
        const textNode = document.createTextNode("Hello");
        paragraph.appendChild(textNode);
        
        // Set selection (cursor) in the middle of the text
        const range = document.createRange();
        range.setStart(textNode, 2);
        range.setEnd(textNode, 2);
        
        const selection = document.getSelection()!;
        selection.removeAllRanges();
        selection.addRange(range);
        
        selectionStateMachine.forceUpdate();
        
        const initialState = selectionStateMachine.getState();
        
        // Test onEvent with selectionchange
        const newState = initialState.onEvent("selectionchange");
        expect(newState).not.toBe(initialState); // Should return new state object
        expect(newState.startContainer).toBe(textNode);
        expect(newState.startOffset).toBe(2);
        
        // Test onEvent with non-selectionchange event
        const unchangedState = initialState.onEvent("click");
        expect(unchangedState).toBe(initialState); // Should return same state object
    });

    test("updateStateFromSelection respects target element validation", () => {
        // Setup initial state
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
        
        // Create element outside the editor
        const outsideElement = document.createElement("div");
        outsideElement.textContent = "outside";
        document.body.appendChild(outsideElement);
        
        // Set selection outside the target element
        const outsideRange = document.createRange();
        outsideRange.selectNodeContents(outsideElement);
        
        selection.removeAllRanges();
        selection.addRange(outsideRange);
        
        // forceUpdate should not change state for outside selections
        selectionStateMachine.forceUpdate();
        
        const finalState = selectionStateMachine.getState();
        expect(finalState).toBe(initialState); // State should remain unchanged
        
        // Cleanup
        document.body.removeChild(outsideElement);
    });
});