import "@testing-library/jest-dom";
import { DomNode } from "../dom-node";

test("getText", () => {
  const paragraph = DomNode.createParagraph();
  paragraph.attachLast(DomNode.createSpan(document.createTextNode('span0')));
  paragraph.attachLast(DomNode.createSpan(document.createTextNode('span1')));
  paragraph.attachLast(DomNode.createSpan(document.createTextNode('span2')));
  paragraph.attachLast(DomNode.createSpan(document.createTextNode('span3')));
  paragraph.attachLast(DomNode.createSpan(document.createTextNode('span4')));
  paragraph.attachLast(DomNode.createSpan(document.createTextNode('span5')));

  const children = paragraph.getChildren();
  expect(children[0].getText()).toEqual('span0')
  expect(children[1].getText()).toEqual('span1')
  expect(children[2].getText()).toEqual('span2')
  expect(children[3].getText()).toEqual('span3')
  expect(children[4].getText()).toEqual('span4')
  expect(children[5].getText()).toEqual('span5')
});