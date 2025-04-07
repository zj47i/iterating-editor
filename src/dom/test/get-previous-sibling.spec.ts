import "@testing-library/jest-dom";
import { DomNode } from "../dom-node";

test("getPreviousSibling", () => {
    const paragraph = DomNode.createParagraph();
    paragraph.attachLast(DomNode.createSpan(document.createTextNode("span0")));
    paragraph.attachLast(DomNode.createSpan(document.createTextNode("span1")));
    paragraph.attachLast(DomNode.createSpan(document.createTextNode("span2")));
    paragraph.attachLast(DomNode.createSpan(document.createTextNode("span3")));
    paragraph.attachLast(DomNode.createSpan(document.createTextNode("span4")));
    paragraph.attachLast(DomNode.createSpan(document.createTextNode("span5")));

    const children = paragraph.getChildren();
    expect(children[1].getPreviousSibling()).toEqual(children[0]);
});
