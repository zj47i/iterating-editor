import "@testing-library/jest-dom";
import { DomNode } from "../dom-node";

describe("DomNode findPathToRoot", () => {
    beforeEach(() => {
        // Set up a mock editor element in the DOM
        document.body.innerHTML = '<div id="@editor"></div>';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test("should return correct path for attached nodes", () => {
        const editor = document.getElementById("@editor") as HTMLElement;
        const editorNode = new DomNode(editor);
        
        const paragraph = DomNode.createParagraph();
        const span1 = DomNode.createSpan(document.createTextNode("span1"));
        const span2 = DomNode.createSpan(document.createTextNode("span2"));
        
        // Build hierarchy: editor > paragraph > span1, span2
        editorNode.attach(paragraph, 0);
        paragraph.attach(span1, 0);
        paragraph.attach(span2, 1);
        
        // Test paths
        const editorPath = editorNode.findPathToRoot();
        expect(editorPath).toEqual([]);
        
        const paragraphPath = paragraph.findPathToRoot();
        expect(paragraphPath).toEqual([0]); // 0th child of editor
        
        const span1Path = span1.findPathToRoot();
        expect(span1Path).toEqual([0, 0]); // 0th child of paragraph, paragraph is 0th child of editor
        
        const span2Path = span2.findPathToRoot();
        expect(span2Path).toEqual([1, 0]); // 1st child of paragraph, paragraph is 0th child of editor
    });

    test("should return empty array for unattached nodes", () => {
        // Create nodes that are not attached to the DOM tree
        const unattachedSpan = DomNode.createSpan(document.createTextNode("unattached"));
        const unattachedParagraph = DomNode.createParagraph();
        
        // These should return empty arrays instead of throwing errors
        const spanPath = unattachedSpan.findPathToRoot();
        expect(spanPath).toEqual([]);
        
        const paragraphPath = unattachedParagraph.findPathToRoot();
        expect(paragraphPath).toEqual([]);
    });

    test("should handle newly created span before attachment", () => {
        // This test simulates the scenario described in the issue
        const textNode = document.createTextNode("test input");
        const newSpan = DomNode.createSpan(textNode);
        
        // At this point, the span is created but not attached yet
        // This should not throw an error but return empty array
        const path = newSpan.findPathToRoot();
        expect(path).toEqual([]);
    });
});