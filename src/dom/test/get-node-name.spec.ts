import "@testing-library/jest-dom";
import { DomNode } from "../dom-node";

test("getNodeName", () => {
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

  expect(paragraph.getNodeName()).toEqual('P')
  expect(spans[0].getNodeName()).toEqual('SPAN')
});