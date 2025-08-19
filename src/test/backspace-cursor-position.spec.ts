import { describe, test, expect, beforeEach } from "@jest/globals";
import { Synchronizer } from "../syncronizer/syncronizer";
import { SelectionStateMachine } from "../state-machine/selection.state-machine";
import { DomNode } from "../dom/dom-node";
import { VDomNode } from "../vdom/vdom-node";
import { VDomNodeType } from "../vdom/vdom-node.enum";
import { Command } from "../command/command";
import { CompositionStateMachine } from "../state-machine/composition.state-machine";
import { position } from "../command/selection/position";
import { mockSyncronizer } from "../syncronizer/test/syncronizer.mock.spec";

describe("Backspace Cursor Position Issue", () => {
    let container: HTMLDivElement;
    let synchronizer: Synchronizer;
    let selectionStateMachine: SelectionStateMachine;
    let compositionStateMachine: CompositionStateMachine;
    let command: Command;
    let span1: DomNode;
    let vSpan1: VDomNode;

    beforeEach(() => {
        // Use the established mock pattern that properly sets up DOM/VDOM sync
        const mock = mockSyncronizer();
        synchronizer = mock.sync;
        selectionStateMachine = mock.selectionStateMachine;
        span1 = mock.span1;  // This has "hello" text
        vSpan1 = mock.vSpan1;
        
        container = document.getElementById("@editor") as HTMLDivElement;
        compositionStateMachine = new CompositionStateMachine(container);
        command = new Command(synchronizer, container, compositionStateMachine, selectionStateMachine);
        
        // Update the span to have the text we want for testing: "aaabccc"
        synchronizer.setText(vSpan1, "aaabccc");
    });

    test("backspace in middle of text should preserve correct cursor position", () => {
        // Setup: text "aaabccc" with cursor at position 4 (after 'b')
        const spanElement = span1.getElement();
        const textNode = spanElement.firstChild as Text;
        
        expect(textNode.textContent).toBe("aaabccc");
        
        // Set cursor to position 4 (after 'b')
        position(textNode, 4);
        selectionStateMachine.forceUpdate();
        
        // Verify initial cursor position
        const initialState = selectionStateMachine.getState();
        expect(initialState.startContainer).toBe(textNode);
        expect(initialState.startOffset).toBe(4);
        
        // Simulate backspace key press
        const backspaceEvent = new KeyboardEvent("keydown", {
            key: "Backspace",
            bubbles: true,
            cancelable: true
        });
        
        command.keydown(backspaceEvent);
        
        // After backspace, text should be "aaaccc" and cursor should be at position 3
        const updatedSpanElement = span1.getElement();
        const updatedTextNode = updatedSpanElement.firstChild as Text;
        expect(updatedTextNode.textContent).toBe("aaaccc");
        
        // Force update to get current selection
        selectionStateMachine.forceUpdate();
        const finalState = selectionStateMachine.getState();
        
        // Cursor should be at position 3 (where the deleted character was)
        expect(finalState.startOffset).toBe(3);
    });

    test("text input in middle should preserve cursor position", () => {
        // Setup: text "abc" with cursor at position 2 (between 'b' and 'c')
        // Update the span to have "abc"
        synchronizer.setText(vSpan1, "abc");
        
        const spanElement = span1.getElement();
        const textNode = spanElement.firstChild as Text;
        
        expect(textNode.textContent).toBe("abc");
        
        // Set cursor to position 2 (between 'b' and 'c')
        position(textNode, 2);
        selectionStateMachine.forceUpdate();
        
        // Verify initial cursor position
        const initialState = selectionStateMachine.getState();
        expect(initialState.startContainer).toBe(textNode);
        expect(initialState.startOffset).toBe(2);
        
        // Simulate what browser does: first modify the text, then fire input event
        textNode.textContent = "abxc";  // Browser inserts 'x' at position 2
        
        // Set cursor to position 3 (after the inserted 'x') - this is what browser does
        position(textNode, 3);
        
        // Now simulate the input event that fires after DOM change
        const inputEvent = new InputEvent("input", {
            data: "x",
            bubbles: true,
            cancelable: true
        });
        
        command.input(inputEvent);
        
        // After input handler, text should still be "abxc"
        const updatedSpanElement = span1.getElement();
        const updatedTextNode = updatedSpanElement.firstChild as Text;
        expect(updatedTextNode.textContent).toBe("abxc");
        
        // Force update to get current selection
        selectionStateMachine.forceUpdate();
        const finalState = selectionStateMachine.getState();
        
        // Cursor should be at position 3 (after the inserted character), not at the end
        expect(finalState.startOffset).toBe(3);
    });
});