import "@testing-library/jest-dom";
import { DomNode } from "../dom-node";
import { TextFormat } from "../../enum/text-format";

test("get-set-format", () => {
    const spans = [
        DomNode.createSpan(document.createTextNode("span0")),
        DomNode.createSpan(document.createTextNode("span1")),
        DomNode.createSpan(document.createTextNode("span2")),
        DomNode.createSpan(document.createTextNode("span3")),
        DomNode.createSpan(document.createTextNode("span4")),
        DomNode.createSpan(document.createTextNode("span5")),
    ];

    spans[0].setFormat(TextFormat.BOLD);
    spans[0].setFormat(TextFormat.ITALIC);
    spans[0].setFormat(TextFormat.UNDERLINE);
    expect(spans[0].getElement().style.fontWeight).toEqual("bold");
    expect(spans[0].getElement().style.fontStyle).toEqual("italic");
    expect(spans[0].getElement().style.textDecoration).toEqual("underline");
    expect(spans[0].getFormats()).toEqual([
        TextFormat.BOLD,
        TextFormat.ITALIC,
        TextFormat.UNDERLINE,
    ]);
});
