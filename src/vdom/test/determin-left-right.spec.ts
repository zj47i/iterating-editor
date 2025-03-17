import { VDomNode } from "../vdom-node";
import { mockVdom } from "./vdom.mock.spec";
import { mockVdom2 } from "./vdom.mock2.spec";

test("determineLeftRight", () => {
    const vdomNode = mockVdom();

    const [left1, right1] = VDomNode.determineLeftRight(
        vdomNode.span2,
        vdomNode.paragraph4
    );

    expect(left1).toBe(vdomNode.span2);
    expect(right1).toBe(vdomNode.paragraph4);

    const [left2, right2] = VDomNode.determineLeftRight(
        vdomNode.span19,
        vdomNode.span18
    );
    expect(left2).toBe(vdomNode.span18);
    expect(right2).toBe(vdomNode.span19);
});

test("determineLeftRight2", () => {
    const vdomNode = mockVdom2();

    const [left1, right1] = VDomNode.determineLeftRight(
        vdomNode.span2,
        vdomNode.paragraph4
    );

    expect(left1).toBe(vdomNode.span2);
    expect(right1).toBe(vdomNode.paragraph4);

    const [left2, right2] = VDomNode.determineLeftRight(
        vdomNode.span19,
        vdomNode.span13
    );
    expect(left2).toBe(vdomNode.span13);
    expect(right2).toBe(vdomNode.span19);
});

test("determineLeftRight3", () => {
    const vdomNode = mockVdom2();

    const [left1, right1] = VDomNode.determineLeftRight(
        vdomNode.paragraph3,
        vdomNode.span10Child2Nested1
    );

    expect(left1).toBe(vdomNode.paragraph3);
    expect(right1).toBe(vdomNode.span10Child2Nested1);

    const [left2, right2] = VDomNode.determineLeftRight(
        vdomNode.span10Child2Nested1,
        vdomNode.paragraph3
    );
    expect(left1).toBe(vdomNode.paragraph3);
    expect(right1).toBe(vdomNode.span10Child2Nested1);
});
