import "@testing-library/jest-dom";
import { mockStateTree } from "./state-node.mock";
import { Synchronizer } from "../syncronizer/syncronizer";
import { mockStateTree2 } from "./state-node.mock2";
import { StateNode } from "./state-node";
import { StateNodeType } from "./state-node.enum";

test("traversalAfterPath", () => {
    const state = mockStateTree();
    const path = state.span5.findPathToRoot();

    const order = StateNode.traversalAfterPath(path);

    expect(order.length).toBe(21);
    expect(order[0]).toBe(state.span5);
    expect(order[1]).toBe(state.span6);
    expect(order[2]).toBe(state.nestedParagraph2);
    expect(order[3]).toBe(state.span7);
    expect(order[4]).toBe(state.paragraph3);
    expect(order[5]).toBe(state.span8);
    expect(order[6]).toBe(state.span9);
    expect(order[7]).toBe(state.span10);
    expect(order[8]).toBe(state.span11);
    expect(order[9]).toBe(state.span12);
    expect(order[10]).toBe(state.span13);
    expect(order[11]).toBe(state.span14);
    expect(order[12]).toBe(state.span15);
    expect(order[13]).toBe(state.paragraph4);
    expect(order[14]).toBe(state.span16);
    expect(order[15]).toBe(state.nestedParagraph3);
    expect(order[16]).toBe(state.span17);
    expect(order[17]).toBe(state.span18);
    expect(order[18]).toBe(state.paragraph5);
    expect(order[19]).toBe(state.span19);
    expect(order[20]).toBe(state.span20);
});

test("traversalAfterPath2", () => {
    const state = mockStateTree2();

    const path = state.span10Child2Nested2.findPathToRoot();

    const order = StateNode.traversalAfterPath(path);

    expect(order.length).toBe(20);
    expect(order[0]).toBe(state.span10Child2Nested2);
    expect(order[1]).toBe(state.nestedParagraph3);
    expect(order[2]).toBe(state.span11);
    expect(order[3]).toBe(state.span12);
    expect(order[4]).toBe(state.deepNestedParagraph1);
    expect(order[5]).toBe(state.span13);
    expect(order[6]).toBe(state.span14);
    expect(order[7]).toBe(state.paragraph4);
    expect(order[8]).toBe(state.span15);
    expect(order[9]).toBe(state.span16);
    expect(order[10]).toBe(state.nestedParagraph4);
    expect(order[11]).toBe(state.span17);
    expect(order[12]).toBe(state.span18);
    expect(order[13]).toBe(state.deeperNestedParagraph);
    expect(order[14]).toBe(state.span19);
    expect(order[15]).toBe(state.span20);
    expect(order[16]).toBe(state.paragraph5);
    expect(order[17]).toBe(state.span21);
    expect(order[18]).toBe(state.span22);
    expect(order[19]).toBe(state.span23);
});

test("preOrderTraversal", () => {
    const state = mockStateTree2();

    const sync = new Synchronizer(document.createElement("div"), state.root);

    const order = state.root.preOrderTraversal();
    expect(order.length).toBe(41);
    expect(order[0]).toBe(state.root);
    expect(order[1]).toBe(state.paragraph1);
    expect(order[2]).toBe(state.span1);
    expect(order[3]).toBe(state.span2);
    expect(order[4]).toBe(state.span3);
    expect(order[5]).toBe(state.paragraph2);
    expect(order[6]).toBe(state.span4);
    expect(order[7]).toBe(state.nestedParagraph1);
    expect(order[8]).toBe(state.span5);
    expect(order[9]).toBe(state.span6);
    expect(order[10]).toBe(state.nestedParagraph2);
    expect(order[11]).toBe(state.span7);
    expect(order[12]).toBe(state.span8);
    expect(order[13]).toBe(state.paragraph3);
    expect(order[14]).toBe(state.span9);
    expect(order[15]).toBe(state.span9Child1);
    expect(order[16]).toBe(state.span9Child2);
    expect(order[17]).toBe(state.span10);
    expect(order[18]).toBe(state.span10Child1);
    expect(order[19]).toBe(state.span10Child2);
    expect(order[20]).toBe(state.span10Child2Nested1);
    expect(order[21]).toBe(state.span10Child2Nested2);
    expect(order[22]).toBe(state.nestedParagraph3);
    expect(order[23]).toBe(state.span11);
    expect(order[24]).toBe(state.span12);
    expect(order[25]).toBe(state.deepNestedParagraph1);
    expect(order[26]).toBe(state.span13);
    expect(order[27]).toBe(state.span14);
    expect(order[28]).toBe(state.paragraph4);
    expect(order[29]).toBe(state.span15);
    expect(order[30]).toBe(state.span16);
    expect(order[31]).toBe(state.nestedParagraph4);
    expect(order[32]).toBe(state.span17);
    expect(order[33]).toBe(state.span18);
    expect(order[34]).toBe(state.deeperNestedParagraph);
    expect(order[35]).toBe(state.span19);
    expect(order[36]).toBe(state.span20);
    expect(order[37]).toBe(state.paragraph5);
    expect(order[38]).toBe(state.span21);
    expect(order[39]).toBe(state.span22);
    expect(order[40]).toBe(state.span23);
});

test("findPathToRoot", () => {
    const state = mockStateTree();

    const path1 = state.span2.findPathToRoot();
    expect(path1.length).toBe(3);
    expect(path1[2]).toBe(state.root);
    expect(path1[1]).toBe(state.paragraph1);
    expect(path1[0]).toBe(state.span2);

    const path2 = state.span18.findPathToRoot();
    expect(path2.length).toBe(4);
    expect(path2[3]).toBe(state.root);
    expect(path2[2]).toBe(state.paragraph4);
    expect(path2[1]).toBe(state.nestedParagraph3);
    expect(path2[0]).toBe(state.span18);
});

test("findLowestCommonAncestor", () => {
    const state = mockStateTree();

    const anscestor1 = StateNode.findLowestCommonAncestor(
        state.span16,
        state.span18
    );
    expect(anscestor1).toBe(state.paragraph4);

    const anscestor2 = StateNode.findLowestCommonAncestor(
        state.span7,
        state.span20
    );
    expect(anscestor2).toBe(state.root);

    const anscestor3 = StateNode.findLowestCommonAncestor(
        state.span14,
        state.span15
    );
    expect(anscestor3).toBe(state.paragraph3);

    const anscestor4 = StateNode.findLowestCommonAncestor(
        state.span4,
        state.span7
    );
    expect(anscestor4).toBe(state.paragraph2);
});

test("findLowestCommonAncestor", () => {
    const state = mockStateTree();

    const anscestor1 = StateNode.findLowestCommonAncestor(
        state.span16,
        state.span18
    );
    expect(anscestor1).toBe(state.paragraph4);

    const anscestor2 = StateNode.findLowestCommonAncestor(
        state.span7,
        state.span20
    );
    expect(anscestor2).toBe(state.root);

    const anscestor3 = StateNode.findLowestCommonAncestor(
        state.span14,
        state.span15
    );
    expect(anscestor3).toBe(state.paragraph3);

    const anscestor4 = StateNode.findLowestCommonAncestor(
        state.span4,
        state.span7
    );
    expect(anscestor4).toBe(state.paragraph2);
});

test("traversalBeforePath", () => {
    const state = mockStateTree();

    const path = state.span10.findPathToRoot();

    const states = StateNode.traversalBeforePath(path);

    expect(states.length).toBe(16);
    expect(states[0]).toBe(state.root);
    expect(states[1]).toBe(state.paragraph1);
    expect(states[2]).toBe(state.span1);
    expect(states[3]).toBe(state.span2);
    expect(states[4]).toBe(state.span3);
    expect(states[5]).toBe(state.paragraph2);
    expect(states[6]).toBe(state.span4);
    expect(states[7]).toBe(state.nestedParagraph1);
    expect(states[8]).toBe(state.span5);
    expect(states[9]).toBe(state.span6);
    expect(states[10]).toBe(state.nestedParagraph2);
    expect(states[11]).toBe(state.span7);
    expect(states[12]).toBe(state.paragraph3);
    expect(states[13]).toBe(state.span8);
    expect(states[14]).toBe(state.span9);
    expect(states[15]).toBe(state.span10);
});

test("findStatesBetween", () => {
    const state = mockStateTree();

    const node1 = state.span2;
    const node2 = state.span18;

    const states = StateNode.findStatesBetween(node1, node2);
    expect(states.length).toBe(23);
    expect(states[0]).toBe(state.span2);
    expect(states[1]).toBe(state.span3);
    expect(states[2]).toBe(state.paragraph2);
    expect(states[3]).toBe(state.span4);
    expect(states[4]).toBe(state.nestedParagraph1);
    expect(states[5]).toBe(state.span5);
    expect(states[6]).toBe(state.span6);
    expect(states[7]).toBe(state.nestedParagraph2);
    expect(states[8]).toBe(state.span7);
    expect(states[9]).toBe(state.paragraph3);
    expect(states[10]).toBe(state.span8);
    expect(states[11]).toBe(state.span9);
    expect(states[12]).toBe(state.span10);
    expect(states[13]).toBe(state.span11);
    expect(states[14]).toBe(state.span12);
    expect(states[15]).toBe(state.span13);
    expect(states[16]).toBe(state.span14);
    expect(states[17]).toBe(state.span15);
    expect(states[18]).toBe(state.paragraph4);
    expect(states[19]).toBe(state.span16);
    expect(states[20]).toBe(state.nestedParagraph3);
    expect(states[21]).toBe(state.span17);
    expect(states[22]).toBe(state.span18);
});

test("findStatesBetween2", () => {
    const state = mockStateTree2();

    const node1 = state.span2;
    const node2 = state.span18;

    const states = StateNode.findStatesBetween(node2, node1);
    expect(states.length).toBe(31);

    expect(states[0]).toBe(state.span2);
    expect(states[1]).toBe(state.span3);
    expect(states[2]).toBe(state.paragraph2);
    expect(states[3]).toBe(state.span4);
    expect(states[4]).toBe(state.nestedParagraph1);
    expect(states[5]).toBe(state.span5);
    expect(states[6]).toBe(state.span6);
    expect(states[7]).toBe(state.nestedParagraph2);
    expect(states[8]).toBe(state.span7);
    expect(states[9]).toBe(state.span8);
    expect(states[10]).toBe(state.paragraph3);
    expect(states[11]).toBe(state.span9);
    expect(states[12]).toBe(state.span9Child1);
    expect(states[13]).toBe(state.span9Child2);
    expect(states[14]).toBe(state.span10);
    expect(states[15]).toBe(state.span10Child1);
    expect(states[16]).toBe(state.span10Child2);
    expect(states[17]).toBe(state.span10Child2Nested1);
    expect(states[18]).toBe(state.span10Child2Nested2);
    expect(states[19]).toBe(state.nestedParagraph3);
    expect(states[20]).toBe(state.span11);
    expect(states[21]).toBe(state.span12);
    expect(states[22]).toBe(state.deepNestedParagraph1);
    expect(states[23]).toBe(state.span13);
    expect(states[24]).toBe(state.span14);
    expect(states[25]).toBe(state.paragraph4);
    expect(states[26]).toBe(state.span15);
    expect(states[27]).toBe(state.span16);
    expect(states[28]).toBe(state.nestedParagraph4);
    expect(states[29]).toBe(state.span17);
    expect(states[30]).toBe(state.span18);
});

test("determineLeftRight", () => {
    const state = mockStateTree();

    const [left1, right1] = StateNode.determineLeftRight(
        state.span2,
        state.paragraph4
    );

    expect(left1).toBe(state.span2);
    expect(right1).toBe(state.paragraph4);

    const [left2, right2] = StateNode.determineLeftRight(
        state.span19,
        state.span18
    );
    expect(left2).toBe(state.span18);
    expect(right2).toBe(state.span19);
});

test("determineLeftRight2", () => {
    const state = mockStateTree2();

    const [left1, right1] = StateNode.determineLeftRight(
        state.span2,
        state.paragraph4
    );

    expect(left1).toBe(state.span2);
    expect(right1).toBe(state.paragraph4);

    const [left2, right2] = StateNode.determineLeftRight(
        state.span19,
        state.span13
    );
    expect(left2).toBe(state.span13);
    expect(right2).toBe(state.span19);
});

test("determineLeftRight2", () => {
    const state = mockStateTree2();

    const [left1, right1] = StateNode.determineLeftRight(
        state.paragraph3,
        state.span10Child2Nested1
    );

    expect(left1).toBe(state.paragraph3);
    expect(right1).toBe(state.span10Child2Nested1);

    const [left2, right2] = StateNode.determineLeftRight(
        state.span10Child2Nested1,
        state.paragraph3
    );
    expect(left1).toBe(state.paragraph3);
    expect(right1).toBe(state.span10Child2Nested1);
});

test("addNextSiblings", () => {
    const state = mockStateTree();

    const span4 = state.span4;
    const parent = span4.parent;
    const index = parent.children.indexOf(span4);

    const newSpan1 = new StateNode(StateNodeType.SPAN);
    const newSpan2 = new StateNode(StateNodeType.SPAN);
    span4.addNextSiblings([newSpan1, newSpan2]);

    expect(parent.children[index]).toBe(span4);
    expect(parent.children[index + 1]).toBe(newSpan1);
    expect(parent.children[index + 2]).toBe(newSpan2);
    expect(parent.children[index + 3]).toBe(state.nestedParagraph1);
});

test("spliceText", () => {
    const span = new StateNode(StateNodeType.SPAN);
    span.spliceText("Hello, World!");
    span.spliceText("Hello, World!", 5);
    expect(span.getText()).toBe("HelloHello, World!, World!");
});

test("levelOrderTraversal", () => {
    const state = mockStateTree();

    const order = state.root.levelOrderTraversal();

    expect(order.length).toBe(29);
    expect(order[0]).toBe(state.root);
    expect(order[1]).toBe(state.paragraph1);
    expect(order[2]).toBe(state.paragraph2);
    expect(order[3]).toBe(state.paragraph3);
    expect(order[4]).toBe(state.paragraph4);
    expect(order[5]).toBe(state.paragraph5);
    expect(order[6]).toBe(state.span1);
    expect(order[7]).toBe(state.span2);
    expect(order[8]).toBe(state.span3);
    expect(order[9]).toBe(state.span4);
    expect(order[10]).toBe(state.nestedParagraph1);
    expect(order[11]).toBe(state.nestedParagraph2);
    expect(order[12]).toBe(state.span8);
    expect(order[13]).toBe(state.span9);
    expect(order[14]).toBe(state.span10);
    expect(order[15]).toBe(state.span11);
    expect(order[16]).toBe(state.span12);
    expect(order[17]).toBe(state.span13);
    expect(order[18]).toBe(state.span14);
    expect(order[19]).toBe(state.span15);
    expect(order[20]).toBe(state.span16);
    expect(order[21]).toBe(state.nestedParagraph3);
    expect(order[22]).toBe(state.span19);
    expect(order[23]).toBe(state.span20);
    expect(order[24]).toBe(state.span5);
    expect(order[25]).toBe(state.span6);
    expect(order[26]).toBe(state.span7);
    expect(order[27]).toBe(state.span17);
    expect(order[28]).toBe(state.span18);
})
