import { describe, test, expect, beforeEach } from "@jest/globals";
import { Synchronizer } from "../syncronizer/syncronizer.ts";
import { SelectionStateMachine } from "../state-machine/selection.state-machine.ts";
import { DomNode } from "../dom/dom-node.ts";
import { VDomNode } from "../vdom/vdom-node.ts";
import { VDomNodeType } from "../vdom/vdom-node.enum.ts";
import { Command } from "../command/command.ts";
import { CompositionStateMachine } from "../state-machine/composition.state-machine.ts";
import { rangeText } from "../command/selection/range.ts";
import { mockSyncronizer } from "../syncronizer/test/syncronizer.mock.spec.ts";

describe("Backspace Range Selection Issue", () => {
    let container: HTMLDivElement;
    let synchronizer: Synchronizer;
    let selectionStateMachine: SelectionStateMachine;
    let compositionStateMachine: CompositionStateMachine;
    let command: Command;

    beforeEach(() => {
        // Use the established mock pattern
        const mock = mockSyncronizer();
        synchronizer = mock.sync;
        selectionStateMachine = mock.selectionStateMachine;
        container = document.getElementById("@editor") as HTMLDivElement;
        compositionStateMachine = new CompositionStateMachine(container);
        
        // Add more test content - add spans to first paragraph to create the scenario  
        const vSpan3 = VDomNode.createVSpan("bbbbb"); 
        synchronizer.appendNewVDomNode(mock.vP1, vSpan3);
        
        command = new Command(synchronizer, container, compositionStateMachine, selectionStateMachine);
    });

    test("backspace should detect and handle range selection", () => {
        // The mock creates structure: 
        // <p><span>hello</span><span>bbbbb</span></p>
        // <p><span>world</span></p>
        
        const paragraphs = container.querySelectorAll("p");
        expect(paragraphs.length).toBe(2);
        
        const firstSpan = paragraphs[0].querySelector("span:nth-child(1)") as HTMLSpanElement;
        const secondSpan = paragraphs[0].querySelector("span:nth-child(2)") as HTMLSpanElement;
        
        const startTextNode = firstSpan.firstChild as Text;
        const endTextNode = secondSpan.firstChild as Text;
        
        expect(startTextNode.textContent).toBe("hello");
        expect(endTextNode.textContent).toBe("bbbbb");
        
        // Select from position 2 in first span to position 2 in second span
        // This selects: "he|llo(span1)bb|bbb(span2)" -> selected: "llo" + "bb"  
        rangeText(startTextNode, 2, endTextNode, 2);
        
        // Force update selection state to ensure it's detected as range
        selectionStateMachine.forceUpdate();
        
        // Verify range selection is set up correctly
        const selection = window.getSelection()!;
        expect(selection.rangeCount).toBe(1);
        expect(selection.isCollapsed).toBe(false);
        expect(selectionStateMachine.isRange()).toBe(true);
        
        // Mock console.info to verify our new logic path is taken
        const originalConsoleInfo = console.info;
        let rangeCalled = false;
        console.info = (...args: any[]) => {
            if (args[0] === "Handling backspace for range selection") {
                rangeCalled = true;
            }
            originalConsoleInfo(...args);
        };
        
        // Simulate backspace key press
        const backspaceEvent = new KeyboardEvent("keydown", {
            key: "Backspace",
            code: "Backspace",
            bubbles: true,
            cancelable: true
        });
        
        command.keydown(backspaceEvent);
        
        // Restore console.info
        console.info = originalConsoleInfo;
        
        // Verify our range selection logic was called
        expect(rangeCalled).toBe(true);
        
        // The test passes if we confirm range logic is triggered - 
        // actual text deletion behavior is tested by existing DeleteHandler tests
    });

    test("backspace should still handle cursor normally", () => {
        // Test that normal cursor backspace still works  
        const firstSpan = container.querySelector("span:nth-child(1)") as HTMLSpanElement;
        const textNode = firstSpan.firstChild as Text;
        
        expect(textNode.textContent).toBe("hello");
        
        // Set cursor at position 3 (between "hel" and "lo")
        const range = document.createRange();
        range.setStart(textNode, 3);
        range.setEnd(textNode, 3);
        
        const selection = window.getSelection()!;
        selection.removeAllRanges();
        selection.addRange(range);
        
        selectionStateMachine.forceUpdate();
        
        // Verify cursor selection
        expect(selection.isCollapsed).toBe(true);
        expect(selectionStateMachine.isCursor()).toBe(true);
        expect(selectionStateMachine.isRange()).toBe(false);
        
        // Mock console.info to verify cursor logic path is taken
        const originalConsoleInfo = console.info;
        let cursorCalled = false;
        console.info = (...args: any[]) => {
            if (args[0] === "Handling backspace in middle of text node") {
                cursorCalled = true;
            }
            originalConsoleInfo(...args);
        };
        
        // Simulate backspace
        const backspaceEvent = new KeyboardEvent("keydown", {
            key: "Backspace",
            code: "Backspace", 
            bubbles: true,
            cancelable: true
        });
        
        command.keydown(backspaceEvent);
        
        // Restore console.info
        console.info = originalConsoleInfo;
        
        // Verify cursor logic was called instead of range logic
        expect(cursorCalled).toBe(true);
    });
});