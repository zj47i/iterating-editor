import "@testing-library/jest-dom";
import { mockVdom } from "./vdom.mock.spec";
import { mockVdom2 } from "./vdom.mock2.spec";
import { VDomNode } from "../vdom-node";
import { VDomNodeType } from "../vdom-node.enum";

test("traversalAfterPath", () => {
    const vdomNode = mockVdom();
    // path는 findPathToAncestorNode(...).reverse()로 노드 배열을 만들어야 함
    const path = vdomNode.span5.findPathToAncestorNode(vdomNode.root)

    const order = VDomNode.traversalAfterPath(path);

    expect(order.length).toBe(21);
    expect(order[0]).toBe(vdomNode.span5);
    expect(order[1]).toBe(vdomNode.span6);
    expect(order[2]).toBe(vdomNode.nestedParagraph2);
    expect(order[3]).toBe(vdomNode.span7);
    expect(order[4]).toBe(vdomNode.paragraph3);
    expect(order[5]).toBe(vdomNode.span8);
    expect(order[6]).toBe(vdomNode.span9);
    expect(order[7]).toBe(vdomNode.span10);
    expect(order[8]).toBe(vdomNode.span11);
    expect(order[9]).toBe(vdomNode.span12);
    expect(order[10]).toBe(vdomNode.span13);
    expect(order[11]).toBe(vdomNode.span14);
    expect(order[12]).toBe(vdomNode.span15);
    expect(order[13]).toBe(vdomNode.paragraph4);
    expect(order[14]).toBe(vdomNode.span16);
    expect(order[15]).toBe(vdomNode.nestedParagraph3);
    expect(order[16]).toBe(vdomNode.span17);
    expect(order[17]).toBe(vdomNode.span18);
    expect(order[18]).toBe(vdomNode.paragraph5);
    expect(order[19]).toBe(vdomNode.span19);
    expect(order[20]).toBe(vdomNode.span20);
});

test("traversalAfterPath2", () => {
    const vdomNode = mockVdom2();
    // path는 findPathToAncestorNode(...).reverse()로 노드 배열을 만들어야 함
    const path = vdomNode.span10Child2Nested2
        .findPathToAncestorNode(vdomNode.root)

    const order = VDomNode.traversalAfterPath(path);

    expect(order.length).toBe(20);
    expect(order[0]).toBe(vdomNode.span10Child2Nested2);
    expect(order[1]).toBe(vdomNode.nestedParagraph3);
    expect(order[2]).toBe(vdomNode.span11);
    expect(order[3]).toBe(vdomNode.span12);
    expect(order[4]).toBe(vdomNode.deepNestedParagraph1);
    expect(order[5]).toBe(vdomNode.span13);
    expect(order[6]).toBe(vdomNode.span14);
    expect(order[7]).toBe(vdomNode.paragraph4);
    expect(order[8]).toBe(vdomNode.span15);
    expect(order[9]).toBe(vdomNode.span16);
    expect(order[10]).toBe(vdomNode.nestedParagraph4);
    expect(order[11]).toBe(vdomNode.span17);
    expect(order[12]).toBe(vdomNode.span18);
    expect(order[13]).toBe(vdomNode.deeperNestedParagraph);
    expect(order[14]).toBe(vdomNode.span19);
    expect(order[15]).toBe(vdomNode.span20);
    expect(order[16]).toBe(vdomNode.paragraph5);
    expect(order[17]).toBe(vdomNode.span21);
    expect(order[18]).toBe(vdomNode.span22);
    expect(order[19]).toBe(vdomNode.span23);
});

test("findPathToRoot", () => {
    const vdomNode = mockVdom();

    const path1 = vdomNode.span2.findPathToRoot();
    expect(path1.length).toBe(2);
    expect(path1[1]).toBe(0); // paragraph1 is 0th child of root
    expect(path1[0]).toBe(1); // span2 is 1st child of paragraph1

    const path2 = vdomNode.span18.findPathToRoot();
    expect(path2.length).toBe(3);
    expect(path2[2]).toBe(3); // paragraph4 is 3rd child of root
    expect(path2[1]).toBe(1); // nestedParagraph3 is 2nd child of paragraph4
    expect(path2[0]).toBe(1); // span18 is 1st child of nestedParagraph3
});

test("findLowestCommonAncestor", () => {
    const vdomNode = mockVdom();

    const anscestor1 = VDomNode.findLowestCommonAncestor(
        vdomNode.span16,
        vdomNode.span18
    );
    expect(anscestor1).toBe(vdomNode.paragraph4);

    const anscestor2 = VDomNode.findLowestCommonAncestor(
        vdomNode.span7,
        vdomNode.span20
    );
    expect(anscestor2).toBe(vdomNode.root);

    const anscestor3 = VDomNode.findLowestCommonAncestor(
        vdomNode.span14,
        vdomNode.span15
    );
    expect(anscestor3).toBe(vdomNode.paragraph3);

    const anscestor4 = VDomNode.findLowestCommonAncestor(
        vdomNode.span4,
        vdomNode.span7
    );
    expect(anscestor4).toBe(vdomNode.paragraph2);
});

test("findLowestCommonAncestor2", () => {
    const vdomNode = mockVdom();

    const anscestor1 = VDomNode.findLowestCommonAncestor(
        vdomNode.span16,
        vdomNode.span18
    );
    expect(anscestor1).toBe(vdomNode.paragraph4);

    const anscestor2 = VDomNode.findLowestCommonAncestor(
        vdomNode.span7,
        vdomNode.span20
    );
    expect(anscestor2).toBe(vdomNode.root);

    const anscestor3 = VDomNode.findLowestCommonAncestor(
        vdomNode.span14,
        vdomNode.span15
    );
    expect(anscestor3).toBe(vdomNode.paragraph3);

    const anscestor4 = VDomNode.findLowestCommonAncestor(
        vdomNode.span4,
        vdomNode.span7
    );
    expect(anscestor4).toBe(vdomNode.paragraph2);
});

test("traversalBeforePath", () => {
    const vdomNode = mockVdom();

    // findPathToAncestorNode로 실제 노드 경로를 만들어야 함
    const pathNodes: VDomNode[] = vdomNode.span10.findPathToAncestorNode(
        vdomNode.root
    );
    // .reverse(); // root부터 span10까지

    const vDomNodes = VDomNode.traversalBeforePath(pathNodes);

    expect(vDomNodes.length).toBe(16);
    expect(vDomNodes[0]).toBe(vdomNode.root);
    expect(vDomNodes[1]).toBe(vdomNode.paragraph1);
    expect(vDomNodes[2]).toBe(vdomNode.span1);
    expect(vDomNodes[3]).toBe(vdomNode.span2);
    expect(vDomNodes[4]).toBe(vdomNode.span3);
    expect(vDomNodes[5]).toBe(vdomNode.paragraph2);
    expect(vDomNodes[6]).toBe(vdomNode.span4);
    expect(vDomNodes[7]).toBe(vdomNode.nestedParagraph1);
    expect(vDomNodes[8]).toBe(vdomNode.span5);
    expect(vDomNodes[9]).toBe(vdomNode.span6);
    expect(vDomNodes[10]).toBe(vdomNode.nestedParagraph2);
    expect(vDomNodes[11]).toBe(vdomNode.span7);
    expect(vDomNodes[12]).toBe(vdomNode.paragraph3);
    expect(vDomNodes[13]).toBe(vdomNode.span8);
    expect(vDomNodes[14]).toBe(vdomNode.span9);
    expect(vDomNodes[15]).toBe(vdomNode.span10);
});

test("findVDomNodesBetween", () => {
    const vdomNode = mockVdom();

    const node1 = vdomNode.span2;
    const node2 = vdomNode.span18;

    const states = VDomNode.findVDomNodesBetween(node1, node2);
    expect(states.length).toBe(23);
    expect(states[0]).toBe(vdomNode.span2);
    expect(states[1]).toBe(vdomNode.span3);
    expect(states[2]).toBe(vdomNode.paragraph2);
    expect(states[3]).toBe(vdomNode.span4);
    expect(states[4]).toBe(vdomNode.nestedParagraph1);
    expect(states[5]).toBe(vdomNode.span5);
    expect(states[6]).toBe(vdomNode.span6);
    expect(states[7]).toBe(vdomNode.nestedParagraph2);
    expect(states[8]).toBe(vdomNode.span7);
    expect(states[9]).toBe(vdomNode.paragraph3);
    expect(states[10]).toBe(vdomNode.span8);
    expect(states[11]).toBe(vdomNode.span9);
    expect(states[12]).toBe(vdomNode.span10);
    expect(states[13]).toBe(vdomNode.span11);
    expect(states[14]).toBe(vdomNode.span12);
    expect(states[15]).toBe(vdomNode.span13);
    expect(states[16]).toBe(vdomNode.span14);
    expect(states[17]).toBe(vdomNode.span15);
    expect(states[18]).toBe(vdomNode.paragraph4);
    expect(states[19]).toBe(vdomNode.span16);
    expect(states[20]).toBe(vdomNode.nestedParagraph3);
    expect(states[21]).toBe(vdomNode.span17);
    expect(states[22]).toBe(vdomNode.span18);
});

test("addNextSiblings", () => {
    const vdomNode = mockVdom();

    const span4 = vdomNode.span4;
    const parent = span4.getParent()!;
    const index = parent.getChildren().indexOf(span4);

    const newSpan1 = VDomNode.createVSpan("");
    const newSpan2 = VDomNode.createVSpan("");
    span4.addNextSiblings([newSpan1, newSpan2]);

    expect(parent.getChildren()[index]).toBe(span4);
    expect(parent.getChildren()[index + 1]).toBe(newSpan1);
    expect(parent.getChildren()[index + 2]).toBe(newSpan2);
    expect(parent.getChildren()[index + 3]).toBe(vdomNode.nestedParagraph1);
});

test("insertText", () => {
    const span = VDomNode.createVSpan("");
    span.insertText("Hello, World!");
    span.insertText("Hello, World!", 5);
    expect(span.getText()).toBe("HelloHello, World!, World!");
});

test("levelOrderTraversal", () => {
    const vdomNode = mockVdom();

    const order = vdomNode.root.levelOrderTraversal();

    expect(order.length).toBe(29);
    expect(order[0]).toBe(vdomNode.root);
    expect(order[1]).toBe(vdomNode.paragraph1);
    expect(order[2]).toBe(vdomNode.paragraph2);
    expect(order[3]).toBe(vdomNode.paragraph3);
    expect(order[4]).toBe(vdomNode.paragraph4);
    expect(order[5]).toBe(vdomNode.paragraph5);
    expect(order[6]).toBe(vdomNode.span1);
    expect(order[7]).toBe(vdomNode.span2);
    expect(order[8]).toBe(vdomNode.span3);
    expect(order[9]).toBe(vdomNode.span4);
    expect(order[10]).toBe(vdomNode.nestedParagraph1);
    expect(order[11]).toBe(vdomNode.nestedParagraph2);
    expect(order[12]).toBe(vdomNode.span8);
    expect(order[13]).toBe(vdomNode.span9);
    expect(order[14]).toBe(vdomNode.span10);
    expect(order[15]).toBe(vdomNode.span11);
    expect(order[16]).toBe(vdomNode.span12);
    expect(order[17]).toBe(vdomNode.span13);
    expect(order[18]).toBe(vdomNode.span14);
    expect(order[19]).toBe(vdomNode.span15);
    expect(order[20]).toBe(vdomNode.span16);
    expect(order[21]).toBe(vdomNode.nestedParagraph3);
    expect(order[22]).toBe(vdomNode.span19);
    expect(order[23]).toBe(vdomNode.span20);
    expect(order[24]).toBe(vdomNode.span5);
    expect(order[25]).toBe(vdomNode.span6);
    expect(order[26]).toBe(vdomNode.span7);
    expect(order[27]).toBe(vdomNode.span17);
    expect(order[28]).toBe(vdomNode.span18);
});
