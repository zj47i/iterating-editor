import "@testing-library/jest-dom";
import { DomNode } from "../dom-node";

// A
//   B
//   C
//   D
// ===========
// X
//   Y
//     1
//     2
//     3
//   Z
//     4

test("attach-detach", () => {
    const spanA = DomNode.createSpan(document.createTextNode("spanA"));
    const spanB = DomNode.createSpan(document.createTextNode("spanB"));
    const spanC = DomNode.createSpan(document.createTextNode("spanC"));
    const spanD = DomNode.createSpan(document.createTextNode("spanD"));

    const spanX = DomNode.createSpan(document.createTextNode("spanX"));
    const spanY = DomNode.createSpan(document.createTextNode("spanY"));
    const spanZ = DomNode.createSpan(document.createTextNode("spanZ"));

    const span1 = DomNode.createSpan(document.createTextNode("span1"));
    const span2 = DomNode.createSpan(document.createTextNode("span2"));
    const span3 = DomNode.createSpan(document.createTextNode("span3"));
    const span4 = DomNode.createSpan(document.createTextNode("span4"));

    spanA.attach(spanB, 0);
    spanA.attach(spanC, 1);
    spanA.attach(spanD, 2);

    spanX.attach(spanY, 0);
    spanX.attach(spanZ, 1);

    spanY.attach(span1, 0);
    spanY.attach(span2, 1);
    spanY.attach(span3, 2);

    spanZ.attach(span4, 0);

    expect(spanA.getChildren()).toEqual([spanB, spanC, spanD]);
    expect(spanX.getChildren()).toEqual([spanY, spanZ]);
    expect(spanY.getChildren()).toEqual([span1, span2, span3]);
    expect(spanZ.getChildren()).toEqual([span4]);

    spanA.attach(spanX, 1);
    expect(spanA.getChildren()).toEqual([spanB, spanX, spanC, spanD]);
    expect(spanX.getChildren()).toEqual([spanY, spanZ]);
    expect(spanY.getChildren()).toEqual([span1, span2, span3]);
    expect(spanZ.getChildren()).toEqual([span4]);

    expect(() => {
        spanA.attach(spanY, 2);
    }).toThrow("node is already attached");

    spanX.detach(spanY);
    expect(spanX.getChildren()).toEqual([spanZ]);

    spanA.attach(spanY, 2);
    expect(spanA.getChildren()).toEqual([spanB, spanX, spanY, spanC, spanD]);
    expect(spanX.getChildren()).toEqual([spanZ]);
    expect(spanY.getChildren()).toEqual([span1, span2, span3]);
    expect(spanZ.getChildren()).toEqual([span4]);
});
