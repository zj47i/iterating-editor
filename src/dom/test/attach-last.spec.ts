import "@testing-library/jest-dom";
import { DomNode } from "../dom-node";

test("attachLast", () => {
  const paragraph = DomNode.createParagraph();
  const spans = [
    DomNode.createSpan(document.createTextNode('span0')),
    DomNode.createSpan(document.createTextNode('span1')),
    DomNode.createSpan(document.createTextNode('span2')),
    DomNode.createSpan(document.createTextNode('span3')),
    DomNode.createSpan(document.createTextNode('span4')),
    DomNode.createSpan(document.createTextNode('span5')),
  ];
  
  spans.forEach((s) => {
    paragraph.attachLast(s);
  });

  const children = paragraph.getChildren();
  expect(children[0]).toEqual(spans[0]);
  expect(children[1]).toEqual(spans[1]);
  expect(children[2]).toEqual(spans[2]);
  expect(children[3]).toEqual(spans[3]);
  expect(children[4]).toEqual(spans[4]);
  expect(children[5]).toEqual(spans[5]);
});