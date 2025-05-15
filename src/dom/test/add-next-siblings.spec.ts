import "@testing-library/jest-dom";
import { DomNode } from "../dom-node";

test("addNextSiblings", () => {
    const paragraph = DomNode.createParagraph();
    const spans = [
        DomNode.createSpan(document.createTextNode("span0")),
        DomNode.createSpan(document.createTextNode("span1")),
        DomNode.createSpan(document.createTextNode("span2")),
        DomNode.createSpan(document.createTextNode("span3")),
        DomNode.createSpan(document.createTextNode("span4")),
        DomNode.createSpan(document.createTextNode("span5")),
    ];

    spans.forEach((s) => {
        paragraph.attachLast(s);
    });

    spans[0].addNextSiblings([
        DomNode.createSpan(document.createTextNode("1")),
        DomNode.createSpan(document.createTextNode("2")),
        DomNode.createSpan(document.createTextNode("3")),
    ]);

    const children = paragraph.getChildren();
    expect(children[0].getText()).toEqual("span0");
    expect(children[1].getText()).toEqual("1");
    expect(children[2].getText()).toEqual("2");
    expect(children[3].getText()).toEqual("3");
});
